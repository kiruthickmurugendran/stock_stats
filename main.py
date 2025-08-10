from fastapi import FastAPI, Body
from fastapi.responses import HTMLResponse  # Import HTMLResponse
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles 
import pandas as pd
from typing import List, Dict
import json
import os

#test change for githup learning

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")


# Sample inventory data (Replace this with a database later)
inventory_data = [
    {"item": "Umbrella", "stock": 12, "category": "Accessories", "sales_last_week": 20, "season": "Rainy"},
    {"item": "Sunscreen", "stock": 5, "category": "Health", "sales_last_week": 15, "season": "Summer"},
    {"item": "Sweater", "stock": 30, "category": "Apparel", "sales_last_week": 5, "season": "Winter"},
    {"item": "Chocolate", "stock": 2, "category": "Food", "sales_last_week": 25, "season": "Festive"},
    {"item": "Notebook", "stock": 50, "category": "Stationery", "sales_last_week": 10, "season": "All"},
]
inventory = pd.DataFrame(inventory_data)

# Request model
class Context(BaseModel):
    weather: str = "clear"
    festival: bool = False


@app.get("/", response_class=HTMLResponse)
async def get_html():
    # Use absolute path for the file
    Frontend_path = os.path.join(os.path.dirname(__file__), "Frontend", "index.html")
    with open(Frontend_path, "r") as file:
        content = file.read()
    return content

@app.post("/report")
def generate_report(context: Context = Body(...)):
    report = []
    for _, item in inventory.iterrows():
        urgency, reasons = emotional_urgency(item, context.dict())
        report.append({
            "item": item['item'],
            "stock": item['stock'],
            "urgency": urgency,
            "reasons": reasons
        })
    # Sort by urgency
    report = sorted(report, key=lambda x: -x['urgency'])
    return {"report": report}

@app.get("/most-loved")
def most_loved_item():
    most_loved = inventory.iloc[inventory['sales_last_week'].idxmax()]
    return {"item": most_loved['item'], "sales": most_loved['sales_last_week']}

def emotional_urgency(item, context):
    urgency = 0
    reasons = []

    # Low stock
    if item['stock'] < 5:
        urgency += 2
        reasons.append("Low stock")

    # High sales
    if item['sales_last_week'] > 15:
        urgency += 2
        reasons.append("Popular item")

    # Weather context
    if item['item'] == "Umbrella" and context.get("weather") == "rain":
        urgency += 3
        reasons.append("Rain predicted")
    if item['item'] == "Sunscreen" and context.get("weather") == "sunny":
        urgency += 2
        reasons.append("Sunny weather")

    # Festival context
    if context.get("festival") and item['category'] == "Food":
        urgency += 2
        reasons.append("Festival demand")

    return urgency, reasons
