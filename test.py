import json
import time

# Function to read posts from the JSON file
def read_posts_from_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# File path for the JSON file
json_file_path = 'posts.json'

# Read initial posts
posts = read_posts_from_file(json_file_path)

last_index = 0
while True:
    current_posts = read_posts_from_file(json_file_path)
    
    while (last_index<=len(current_posts)):
        print(f"Here is a new post!: {json.dumps(current_posts[last_index-1], indent=2)}")
        print("\n")
        last_index += 1
    print("Waiting for more data...")
    time.sleep(5)
