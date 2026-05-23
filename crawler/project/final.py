from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import random
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
import unicodedata
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def scroll_and_collect_post_links(driver, num_scrolls, start_from=100, max_posts=5):
    post_links = []
    wait = WebDriverWait(driver, 10)

    for _ in range(num_scrolls):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        try:
            wait.until(lambda d: d.execute_script("return document.readyState") == "complete")
        except:
            pass 

        time.sleep(random.uniform(10, 15)) 

        soup = BeautifulSoup(driver.page_source, 'html.parser')

        for a in soup.find_all('a', href=True):
            if re.match(r'^/p/[\w-]+/$', a['href']):
                full_url = "https://www.instagram.com" + a['href']
                if full_url not in post_links: 
                    post_links.append(full_url)

        if len(post_links) >= start_from + max_posts:
            break

    return post_links[start_from:start_from + max_posts]



def is_mostly_emoji(text):
    return all(
        unicodedata.category(char).startswith(('S', 'P')) or char.isspace()
        for char in text
    )

def extract_json_comments(html, max_comments=5):
    pattern = r'"text":"(.*?)","giphy_media_info"'
    matches = re.findall(pattern, html)
    comments = []

    for comment in matches:
        try:

            clean_comment = json.loads(f'"{comment}"').strip()

            if not clean_comment or is_mostly_emoji(clean_comment):
                continue

            comments.append(clean_comment)
            if len(comments) >= max_comments:
                break
        except Exception as e:
            print(f"Error decoding comment: {e} - Original: '{comment[:50]}...'")
            continue

    return comments

def extract_post_data_from_html(html, url):
    soup = BeautifulSoup(html, 'html.parser')
    post_data = {
        "url": url,
        "caption": None,
        "tags": [],
        "owner": None,
        "likes": None,
        "comments_count": None,
        "top_comments": [],
        "date": None
    }

    likes_match = re.search(r'"like_count":(\d+)', html)
    if likes_match:
        post_data["likes"] = int(likes_match.group(1))

    comments_count_match = re.search(r'"comment_count":(\d+)', html)
    if comments_count_match:
        post_data["comments_count"] = int(comments_count_match.group(1))

    meta_tag = soup.find("meta", property="og:description")
    if meta_tag and "content" in meta_tag.attrs:
        raw_description = meta_tag["content"]

        match = re.search(r':\s*"([^"]+)', raw_description)
        if match:
            caption_and_tags_text = match.group(1).strip()

            found_tags = re.findall(r"#\S+", caption_and_tags_text)
            individual_tags = []
            for tag_block in found_tags:
                split_tags = re.findall(r"#[^#]+", tag_block)
                individual_tags.extend(split_tags)
            post_data["tags"] = individual_tags

            post_data["caption"] = re.sub(r"#\S+", "", caption_and_tags_text).strip()

        owner_match = re.search(r'comments - ([\w\.]+) on', raw_description)
        if owner_match:
            post_data["owner"] = owner_match.group(1)

        date_match = re.search(r'on ([A-Za-z]+\s+\d{1,2},\s+\d{4})', raw_description)
        if date_match:
            post_data["date"] = datetime.strptime(date_match.group(1), "%B %d, %Y").date().isoformat()

    post_data["top_comments"] = extract_json_comments(html)

    return post_data

def append_to_json(filename, data):
    try:
        with open(filename, 'r+', encoding='utf-8') as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = []
            existing_data.extend(data)
            f.seek(0)
            json.dump(existing_data, f, ensure_ascii=False, indent=2)
            f.truncate()
    except FileNotFoundError:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    tags_to_search = ["sol", "dogecoin", "trustwallet", "btc",  "memecoin", 
                      "ripple", "bitcoin", "usdt", "eth", "digitalassets",  "tokenization", 
                      "altcoin", "bnb", "tether", "solana", "cardano", "ethereum",                  
                      "coinbase", "hodl", "bullrun", "blockchain", "defi",
                      "binance", "crypto", "altseason", "altcoins", "cryptomarket",
                      "smartcontract", "erc20", "crypto", "trc20", "ethereum", 
                      "ton", "shib", "btc", "nft", "smartchain", "usdc"
                      ]
    num_scrolls_per_tag = 2
    max_posts_per_tag = 14
    output_filename = "output.json"
    options = webdriver.ChromeOptions()
    options.add_argument("user-data-dir=/tmp/selenium")
    driver = webdriver.Chrome(options=options)

    try:
        for tag in tags_to_search:
            print(f"\nScraping #{tag}")
            driver.get(f"https://www.instagram.com/explore/tags/{tag}/")
            time.sleep(5)

            post_links = scroll_and_collect_post_links(driver, num_scrolls_per_tag, start_from=0, max_posts=max_posts_per_tag)

            print(f"Found {len(post_links)} posts.")

            results = []
            for link in post_links:
                try:
                    print(f"Scraping: {link}")
                    driver.get(link)

                    WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, "//meta[@property='og:description']"))
                    )

                    html = driver.page_source
                    post_data = extract_post_data_from_html(html, link)
                    results.append(post_data)

                    time.sleep(random.uniform(11, 17))
                except Exception as e:
                    print(f"Error scraping {link}: {e}")

            append_to_json(output_filename, results)
            print(f"Saved {len(results)} posts for #{tag} to {output_filename}")

    finally:
        driver.quit()
        print("\nDone!")

