import json
import csv
import os
import re


def generate_items_json():
    # Paths
    enums_path = os.path.join(os.path.dirname(__file__), "Enums_Internal.json")
    item_data_path = os.path.join(os.path.dirname(__file__), "itemData.user.3.json")
    msg_csv_path = os.path.join(os.path.dirname(__file__), "Item.msg.23.csv")
    output_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../src/assets/items.json")
    )

    # Load Enums
    print(f"Loading {enums_path}...")
    with open(enums_path, "r", encoding="utf-8") as f:
        enums_data = json.load(f)

    # Get ID map (Label -> ID)
    # app.ItemDef.ID
    item_def_map = enums_data.get("app.ItemDef.ID", {})

    # Load Item Data
    print(f"Loading {item_data_path}...")
    with open(item_data_path, "r", encoding="utf-8") as f:
        item_data_json = json.load(f)

    # Load CSV
    print(f"Loading {msg_csv_path}...")
    msg_data = {}
    with open(msg_csv_path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            guid = row["guid"]
            msg_data[guid] = row

    # Language mapping
    lang_map = {
        0: "Japanese",
        1: "English",
        2: "French",
        3: "Italian",
        4: "German",
        5: "Spanish",
        6: "Russian",
        7: "Polish",
        10: "PortugueseBr",
        11: "Korean",
        12: "TraditionalChinese",
        13: "SimplifiedChinese",
        21: "Arabic",
        32: "LatinAmericanSpanish",
    }

    # Extract all items
    raw_items = []
    if isinstance(item_data_json, list):
        for chunk in item_data_json:
            # Structure: chunk -> app.user_data.ItemData -> _Values -> list
            if "app.user_data.ItemData" in chunk:
                vals = chunk["app.user_data.ItemData"].get("_Values", [])
                raw_items.extend(vals)

    parsed_items = []

    # Regex to parse [FixedId]Label
    # Example: [622]ITEM_0648
    item_id_pattern = re.compile(r"\[(\d+)\](.+)")

    for entry in raw_items:
        # entry -> app.user_data.ItemData.cData
        cdata = entry.get("app.user_data.ItemData.cData", {})

        raw_item_id_str = cdata.get("_ItemId")  # e.g. "[1]NONE"
        raw_name_guid = cdata.get("_RawName")

        if not raw_item_id_str:
            continue

        # Parse _ItemId
        match = item_id_pattern.match(raw_item_id_str)
        if match:
            fixed_id = int(match.group(1))
            label = match.group(2)
        else:
            # Fallback if pattern doesn't match?
            print(f"Warning: Could not parse _ItemId: {raw_item_id_str}")
            continue

        # Get ID from Enum map
        # Use label to lookup
        item_id = item_def_map.get(label)

        if item_id is None:
            # If label not found in Enum, maybe skip or set -1?
            # User said: "get label corresponding id" from Enum.
            # If not found, it might be invalid.
            # But let's verify if "NONE" is 0.
            # In Enum: "NONE": 0.
            # In Data: "[1]NONE". FixedId=1, Label=NONE.
            # So item_id should be 0.
            print(f"Warning: Label '{label}' not found in app.ItemDef.ID")
            item_id = 0  # Default?

        # Get Names from CSV
        name_dict = {}
        msg_row = msg_data.get(raw_name_guid)

        if msg_row:
            for code, col_name in lang_map.items():
                val = msg_row.get(col_name, "---")
                if val == "" or val is None:
                    val = "---"
                name_dict[str(code)] = val
        else:
            for code in lang_map.keys():
                name_dict[str(code)] = "---"

        parsed_items.append(
            {"id": item_id, "fixedId": fixed_id, "label": label, "name": name_dict}
        )

    # Sort items based on fixedId as per previous pattern, or keep them as is?
    # Usually fixedId is the natural order for "Items".
    # User request didn't specify sort order this time, but previously "items.json" usually sorted by ID or FixedId.
    # Given that `id` comes from `app.ItemDef.ID`, which might be sparse or arbitrary?
    # Actually, `fixedId` seems to be the comprehensive list index in the save data/internal logic often.
    # Let's sort by fixedId to be safe and consistent.
    parsed_items.sort(key=lambda x: x["fixedId"])

    # Write to JSON
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(parsed_items, f, ensure_ascii=False, indent=4)

    print(f"Generated {len(parsed_items)} items to {output_path}")


if __name__ == "__main__":
    generate_items_json()
