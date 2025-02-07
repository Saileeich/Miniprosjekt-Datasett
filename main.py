import requests
import json
from google.transit import gtfs_realtime_pb2
from google.protobuf.json_format import MessageToDict
import pandas as pd

def get_data():
    # Get data from Entur API
    response = requests.get("https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions?datasource=KOL")
    
    # Parse the data to json format
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(response.content)

    # Write the data to a file
    with open("vehicle_positions.json", "w") as file:
        json.dump(MessageToDict(feed), file, indent=4)
    
    # Return the filepath
    return "vehicle_positions.json"

def read_file(filepath):
    with open(filepath, "r") as file:
        return json.load(file)

dataset = read_file(get_data())
#dataset = read_file("vehicle_positions.json")

fixed_dataset = [x["vehicle"] for x in dataset["entity"]]

df = pd.DataFrame(fixed_dataset)
print(len(df))

