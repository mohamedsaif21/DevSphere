import requests
import json

JUDGE0_URL = "http://localhost:2358"

try:
    # Test health
    print("Testing Judge0 health...")
    resp = requests.get(f"{JUDGE0_URL}/about", timeout=5)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.json()}")
    
    # Submit simple Python code
    print("\n\nSubmitting Python code to Judge0...")
    payload = {
        "source_code": "print('Hello from Judge0!')",
        "language_id": 71,
        "stdin": ""
    }
    
    submit_resp = requests.post(
        f"{JUDGE0_URL}/submissions?base64_encoded=false&wait=true",
        json=payload,
        timeout=10
    )
    
    print(f"Submission Status: {submit_resp.status_code}")
    result = submit_resp.json()
    print(f"Result: {json.dumps(result, indent=2)}")
    
    if result.get('status', {}).get('description'):
        print(f"\n✓ Execution Status: {result['status']['description']}")
    if result.get('stdout'):
        print(f"Output: {result['stdout']}")
    if result.get('stderr'):
        print(f"Error: {result['stderr']}")
    
except Exception as e:
    print(f"Error: {e}")
    print("Judge0 might not be ready yet. Wait 10-15 seconds and try again.")
