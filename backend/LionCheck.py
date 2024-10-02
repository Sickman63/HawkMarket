import os
import re
import speedtest

def check_ping(host):
    response = os.system(f"ping -n 1 {host}")
    return response == 0

def ping_latency(host):
    # Execute the ping command and capture the output
    result = os.popen(f"ping -n 1 {host}").read()
    # Extract the latency using a regular expression
    match = re.search(r"Average = (\d+)ms", result)
    if match:
        return int(match.group(1))
    else:
        return None

def speed_test():
    st = speedtest.Speedtest()
    st.download()
    st.upload()
    results = st.results.dict()
    return results['download'], results['upload']

def main():
    # Check internet connectivity
    internet_host = "8.8.8.8"
    if check_ping(internet_host):
        print("Internet is up")
        latency = ping_latency(internet_host)
        if latency is not None:
            print(f"Internet latency: {latency} ms\n")
        else:
            print("Could not measure internet latency\n")
    else:
        print("Internet is down\n")

    # Check local network connectivity
    local_gateway = "192.168.1.1"  # Replace with your actual gateway IP
    if check_ping(local_gateway):
        print("Local network is up")
        latency = ping_latency(local_gateway)
        if latency is not None:
            print(f"Local network latency: {latency} ms\n")
        else:
            print("Could not measure local network latency\n")
    else:
        print("Local network is down\n")

    # Perform speed test
    print("Performing speed test...")
    download_speed, upload_speed = speed_test()
    print(f"Download speed: {download_speed / 1_000_000:.2f} Mbps")
    print(f"Upload speed: {upload_speed / 1_000_000:.2f} Mbps\n")

if __name__ == "__main__":
    main()