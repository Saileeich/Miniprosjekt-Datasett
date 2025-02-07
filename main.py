import requests
import pyrosm

def get_data():
    # Get data from Entur API
    response = requests.get("https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions")
    
    # Write the data to a file
    with open("vehicle_positions.pbf", "wb") as file:
        file.write(response.content)
    
    # Return the filepath
    return "vehicle_positions.pbf"

def read_file(filepath):
    # Opens file and returns the content
    with open(filepath, "rb") as file:
        return file.read()

print(read_file(get_data()))
