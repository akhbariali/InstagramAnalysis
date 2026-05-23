from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.db.models.functions import Lower
from rest_framework import viewsets, filters, generics, status, permissions
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Posts
from .serializers import (
    PostsSerializer, PostDetailSerializer, WordCloudRequestSerializer,
    IdOnlySerializer, PostsExportSerializer, PostsExportFilterSerializer
)
from .filters import PostsFilter
from io import BytesIO
import base64, re, unicodedata, os
from wordcloud import WordCloud, STOPWORDS
import arabic_reshaper
from bidi.algorithm import get_display
import matplotlib
import pandas as pd
from collections import Counter
from PIL import features

matplotlib.use("Agg")

class PostsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Posts.objects.all().order_by('-post_date')
    serializer_class = PostsSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_class = PostsFilter
    search_fields = ['caption']
    renderer_classes = [JSONRenderer]

class PostDetailView(generics.RetrieveAPIView):
    queryset = Posts.objects.all()
    serializer_class = PostDetailSerializer
    lookup_field = "id"

class PostIdsView(generics.ListAPIView):
    queryset = Posts.objects.all()
    serializer_class = IdOnlySerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_class = PostsFilter
    search_fields = ['caption']
    pagination_class = None

    def list(self, request, *args, **kwargs):
        qs = self.filter_queryset(self.get_queryset())
        qs = qs.order_by('-post_date', 'id')

        try:
            limit = int(request.query_params.get('limit', 1000))
            offset = int(request.query_params.get('offset', 0))
        except ValueError:
            limit, offset = 1000, 0

        sliced = qs.values_list('id', flat=True)[offset:offset+limit]
        ids = list(sliced)
        return Response({
            "count": qs.count(),
            "offset": offset,
            "limit": limit,
            "ids": ids,
        })

        
USE_RAQM = features.check_feature("raqm")

_BIDI_CTRL_RE = re.compile(r"[\u200E\u200F\u061C\u202A-\u202E\u2066-\u2069]")
def _sanitize(s: str) -> str:
    s = unicodedata.normalize("NFKC", s)
    return _BIDI_CTRL_RE.sub("", s)

_TOKEN_RE = re.compile(
    r"[A-Za-z0-9_]+|[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u200C\u200D]+"
)

def _tokens(text: str):
    toks = _TOKEN_RE.findall(text)
    return toks or text.split()

def _display_token(token: str) -> str:
    t = _sanitize(token)
    if USE_RAQM:
        return t
    else:
        resh = arabic_reshaper.reshape(t)
        return get_display(resh, base_dir='R')

class WordCloudView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = WordCloudRequestSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        ids = ser.validated_data["ids"]
        width = ser.validated_data["width"]
        height = ser.validated_data["height"]
        background = ser.validated_data["background"]

        font_path = getattr(settings, "WORDCLOUD_FONT", "/usr/src/app/assets/fonts/tahoma.ttf")

        captions = list(Posts.objects.filter(id__in=ids).values_list("caption", flat=True))
        captions = [c for c in captions if c]
        if not captions:
            return Response({"detail": "No captions found for the provided ids."}, status=400)

        raw_text = " ".join(captions)
        toks = _tokens(raw_text) 

        stopwords = set(STOPWORDS) 
        extra_stopwords = {
            "rt", "via", "http", "https", "www", "com",
            ":", ";", "-", "--",                       
            "…", "“", "”",                             
            "با" , "و" , "یا" , "پس" ,"اگه", "اگر" , "نه" , "را" , "چون" , "چه" , "تا" , 
            "اما" , "باری" , "خواه" , "زیرا" , "که" , "لیکن" , "نیز" , "ولی" , "هم" ,
            "نه" , "چه" , "از" , "به"  , "در" , "برای" , "بر", "است", "رو" , "این", "آن", "اون", "اینو", "اونو",

        }
        stopwords.update(w.lower() for w in extra_stopwords)
        def is_noise(tok: str) -> bool:
            t = tok.strip().lower()
            if not t:
                return True
            if len(t) <= 1:               # remove single-letter tokens like "a", "I"
                return True
            if t.isdigit():               # remove tokens that are only digits
                return True
            return False

        filtered_toks = [
            tok for tok in toks
            if not is_noise(tok) and tok.lower() not in stopwords
        ]

        freqs = Counter(filtered_toks)

        display_freqs = {}
        for tok, cnt in freqs.items():
            disp = _display_token(tok)
            if not disp:
                continue
            if disp.lower() in stopwords:
                continue
            if is_noise(disp):
                continue
            display_freqs[disp] = display_freqs.get(disp, 0) + cnt
        wc = WordCloud(
            font_path=font_path,
            width=width,
            height=height,
            background_color=background,
            collocations=False,
            prefer_horizontal=1.0,
            regexp=_TOKEN_RE.pattern,
            stopwords=STOPWORDS,
        ).generate_from_frequencies(display_freqs)

        buf = BytesIO()
        wc.to_image().save(buf, format="PNG")
        buf.seek(0)
        return HttpResponse(buf.getvalue(), content_type="image/png")

class PostsExportView(APIView):
    def post(self, request, *args, **kwargs):
        ser = PostsExportFilterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        fmt = ser.validated_data.get("format")
        sentiments = ser.validated_data.get("sentiment", [])
        search = ser.validated_data.get("search", "")
        from_date = ser.validated_data.get("from_date")
        to_date = ser.validated_data.get("to_date")

        qs = Posts.objects.all()

        if from_date:
            qs = qs.filter(post_date__gte=from_date)
        if to_date:
            qs = qs.filter(post_date__lte=to_date)
        if search:
            qs = qs.filter(caption__icontains=search)
        if sentiments:
            lowered = [s.lower() for s in sentiments if s]
            if lowered:
                qs = qs.annotate(_sent=Lower("sentiment_overall")).filter(_sent__in=lowered)

        rows = list(qs.values(
            "id", "url", "caption", "owner", "likes", "comments_count",
            "post_date", "sentiment_overall", "lstm_prediction", "rf_prediction",
            "svm_prediction", "dt_prediction", "lr_prediction", "tags", "top_comments"
        ))

        if not rows:
            return Response({"detail": "No data found."}, status=status.HTTP_404_NOT_FOUND)

        df = pd.DataFrame(rows)

        buf = BytesIO()
        if fmt == "xlsx":
            try:
                with pd.ExcelWriter(buf, engine="openpyxl") as writer:
                    if "post_date" in df.columns:
                        df["post_date"] = pd.to_datetime(df["post_date"], errors="coerce").dt.tz_localize(None)
                        df["post_date"] = df["post_date"].dt.strftime("%Y-%m-%d %H:%M:%S")
                    df.to_excel(writer, index=False, sheet_name="posts")
            except Exception as e:
                return Response(
                    {"detail": f"Failed to create XLSX (do you have openpyxl installed?): {e}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            filename = "posts_export.xlsx"
        else:
            df.to_csv(buf, index=False)
            mime = "text/csv"
            filename = "posts_export.csv"

        buf.seek(0)
        file_b64 = base64.b64encode(buf.read()).decode("utf-8")

        return Response({
            "mime": mime,
            "filename": filename,
            "file_base64": file_b64,
            "count": len(df),
        })