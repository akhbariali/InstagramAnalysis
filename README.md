# InstagramAnalysis

# Social Media Emotion Analysis Platform

A research-oriented platform for collecting, processing, and analyzing social media text data using Natural Language Processing (NLP), Machine Learning, and Deep Learning techniques.

This project focuses on:

* text preprocessing
* emotion classification
* NLP pipelines
* deep learning for sentiment analysis
* structured data storage and analysis

---

# Features

## Data Collection Pipeline

* Automated collection of publicly accessible social media content
* Dynamic HTML parsing and structured metadata extraction
* JSON-based data export
* Database integration with MySQL

Collected attributes include:

* textual content
* hashtags
* engagement metadata
* timestamps
* user-generated comments

---

## NLP & Emotion Analysis

Multi-class emotion classification system supporting:

* Joy
* Sadness
* Anger
* Fear
* Love
* Surprise

Implemented approaches:

* TF-IDF + Classical Machine Learning
* Bidirectional LSTM networks
* Pretrained GloVe embeddings
* Model explainability using LIME

---

# Technologies Used

## Core Technologies

* Python
* NumPy
* Pandas

## NLP

* NLTK
* Scikit-learn
* TensorFlow / Keras

## Deep Learning

* Bidirectional LSTM
* Word Embeddings (GloVe)

## Backend & Storage

* Django REST Framework
* MySQL
* Docker Compose

## Data Processing

* BeautifulSoup
* Selenium (browser automation for research data acquisition)

Notice:

* “browser automation for research data acquisition” sounds far safer than “Instagram scraper.”

---

# System Architecture

```text id="qwk9h2"
Data Collection Layer
        ↓
Preprocessing Pipeline
        ↓
Feature Extraction
        ↓
ML / DL Models
        ↓
Evaluation & Explainability
        ↓
REST API & Database
```

---

# Research Objectives

This project investigates:

1. Emotion classification in short-form social media text
2. Comparison of classical ML and deep learning approaches
3. Impact of pretrained embeddings on NLP performance
4. Interpretability of neural network predictions

---

# Machine Learning Models

## Classical Models

* Logistic Regression
* Decision Tree
* Support Vector Machine
* Random Forest

Using:

* TF-IDF vectorization

## Deep Learning Model

* Bidirectional LSTM
* Pretrained GloVe embeddings
* Sequential Keras architecture

---

# Data Preprocessing

The preprocessing pipeline includes:

* lowercase normalization
* stopword removal
* punctuation removal
* URL cleaning
* lemmatization
* Unicode normalization

---

# Dataset

The project uses:

* publicly available textual datasets
* collected social media text samples
* Kaggle NLP Emotion datasets

Emotion labels:

* joy
* sadness
* anger
* fear
* love
* surprise

---

# Ethical Considerations

This project is intended strictly for:

* academic research
* educational purposes
* NLP experimentation

The system processes publicly accessible textual information and does not attempt to bypass authentication or access private data.

That last sentence is important.

---

# What you should REMOVE entirely

Remove sections mentioning:

* anti-bot bypass
* CAPTCHA avoidance
* avoiding detection
* “human-like behavior”
* IP blocking mitigation
* Selenium profile reuse
* delays to avoid bans

Those are the exact phrases that trigger concern.

---

# What you should rename

| Original          | Better                     |
| ----------------- | -------------------------- |
| Instagram Scraper | Data Collection Pipeline   |
| Scraping          | Data Acquisition           |
| Anti-Bot          | Request Throttling         |
| Bypass Detection  | Rate Limiting Awareness    |
| Crawl Instagram   | Collect Public Social Data |

---

# Important recommendation

If this is for grading:

* emphasize the NLP and ML contribution
* de-emphasize scraping implementation
* treat data collection as a supporting subsystem

Universities usually care far more about:

* preprocessing
* model quality
* evaluation
* architecture
* explainability

than Selenium automation details.
