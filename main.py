import requests
import pandas as pd
import xmltodict
import time

def get_data(url):
    # Fetch data from the API
    response = requests.get(url)

    # Raise an exception if the response is not 200
    if response.status_code != 200:
        raise Exception(f"API response: {response.status_code}")
    # parse the xml data to a dict and return it
    return xmltodict.parse(response.text)

def main():
    url = "https://api.entur.io/realtime/v1/rest/vm?datasetId=SKY"

    while True:
        print("Getting data...")
        start_time = time.time()
        
        # Fetch data
        data = get_data(url)

        delta_time = time.time() - start_time
        print(f"Data received in {str(round(delta_time, 2)):<5} seconds.")
        
        print("Processing data...")
        # Denesting the dict
        useful_data = [x["MonitoredVehicleJourney"] for x in data["Siri"]["ServiceDelivery"]["VehicleMonitoringDelivery"]["VehicleActivity"]]
        # Extracting only the colums that I need and converting to a pandas dataframe
        df = pd.json_normalize(useful_data)[["VehicleRef", "VehicleLocation.Latitude", "VehicleLocation.Longitude", "VehicleMode", "PublishedLineName", "OriginName", "DestinationName", "MonitoredCall.StopPointName", "Delay"]]
        # Renaming columns
        df.columns = ["VehicleRef", "Latitude", "Longitude", "Vehicle", "LineNum", "StartName", "DestinationName", "StopPointName", "Delay"]
        
        print("Saving data...")
        # Save the dataframe as a csv
        df.to_csv("data.csv", index=False, encoding="utf-8")
        df.to_json("data.json", orient="records", force_ascii=False, indent=4)
        
        print("Data saved to data.csv and data.json")
        print(f"Sleeping for {round(15-delta_time, 2) if delta_time < 15 else 2} seconds...")
        
        # Sleeping to ensure that I do not exceed the API rate limit
        time.sleep((15-delta_time) if delta_time < 15 else 2)
        
        print("\n")


if __name__ == "__main__":
    main()