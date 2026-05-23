# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Posts(models.Model):
    url = models.CharField(max_length=255)
    caption = models.TextField(blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)
    owner = models.CharField(max_length=100, blank=True, null=True)
    likes = models.IntegerField(blank=True, null=True)
    comments_count = models.IntegerField(blank=True, null=True)
    top_comments = models.JSONField(blank=True, null=True)
    post_date = models.DateTimeField(blank=True, null=True)

    lstm_prediction = models.CharField(max_length=32, blank=True, null=True, default=None)
    rf_prediction   = models.CharField(max_length=32, blank=True, null=True, default=None)
    svm_prediction  = models.CharField(max_length=32, blank=True, null=True, default=None)
    dt_prediction   = models.CharField(max_length=32, blank=True, null=True, default=None)
    lr_prediction   = models.CharField(max_length=32, blank=True, null=True, default=None)
    sentiment_overall = models.CharField(max_length=32, blank=True, null=True, default=None)

    class Meta:
        db_table = 'posts'
        verbose_name = "Post"  
        verbose_name_plural = "Posts"
