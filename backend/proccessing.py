
# file: backend/proccessing.py
import random

def get_fake_prices(distance, user_id):
    """
    Generate fake price data for each app: random rate between 3.0 and 5.0 SAR per km,
    multiplied by 'distance'. Return it immediately.
    """
    apps = ["Uber", "Bolt", "Jeeny", "Careem"]
    results = []

    for app in apps:
        # random rate between 3.0 and 5.0
        rate = random.uniform(3.0, 5.0)
        total_price = distance * rate
        price_str = f"{total_price:.2f} SAR"
        results.append({
            "app": app,
            "price": price_str,
            "user_id": user_id
        })

    return results
