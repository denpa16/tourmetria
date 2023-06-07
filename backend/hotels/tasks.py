from celery import shared_task


@shared_task
def parse_images():
    from bs4 import BeautifulSoup
    import requests

    from hotels.models import Hotel

    hotels_ref_ids = set(Hotel.objects.values_list("ref_id", flat=True))
    count = 0
    for hotel_ref_id in hotels_ref_ids:
        url = f"https://bgoperator.ru/price.shtml?flt=100411293179&tid=26&code={hotel_ref_id}&action=shw"
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41",
            "Content-Type": "application/json",
            "Referer": url,
        }

        session = requests.Session()
        response = session.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")
        gallery = soup.find("div", class_="image")
        if gallery is not None:
            count += 1
            print(count)
            #lies = gallery.find("ul")
            #new_lies = lies.find_all("a")
            #links = list()
            #for a in new_lies[::-1]:
            #    if a["class"] != ["button"]:
            #        img_src = a["href"]
            #        links.append(f"https://www.bgoperator.ru{img_src}")
            #    else:
            #        break
            #
            #images = links[::-1]
            #
            #for image_url in images:
            #    response = requests.get(image_url)
            #    name = image_url.split("/")[-1].split(".")[0]
            #    print(image_url)
                # f = open(f"{name}.png", "wb")
                # f.write(response.content)
                # f.close()

    print(f"All_images_count: {count}")