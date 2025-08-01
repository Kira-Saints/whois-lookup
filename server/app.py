# Filename: server/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

WHOIS_API_KEY = os.getenv('WHOIS_API_KEY')

WHOIS_API_URL = "https://www.whoisxmlapi.com/whoisserver/WhoisService"

def calculate_domain_age(registration_date_str):
    try:
        registration_date = datetime.strptime(registration_date_str, "%Y-%m-%dT%H:%M:%SZ")
        today = datetime.utcnow()
        delta_years = today.year - registration_date.year
        if today.month < registration_date.month or (today.month == registration_date.month and today.day < registration_date.day):
            delta_years -= 1
        return f"{delta_years} years"
    except Exception:
        return "Unknown"

@app.route('/api/whois', methods=['POST'])
def get_whois():
    data = request.json
    domain = data.get("domain")
    data_type = data.get("dataType")  # either "domain" or "contact"

    if not domain or not data_type:
        return jsonify({"error": "Missing domain or dataType"}), 400

    params = {
        "apiKey": WHOIS_API_KEY,
        "domainName": domain,
        "outputFormat": "JSON"
    }

    try:
        response = requests.get(WHOIS_API_URL, params=params)
        response.raise_for_status()
        whois_data = response.json().get("WhoisRecord", {})

        if data_type == "domain":
            result = {
                "domainName": whois_data.get("domainName", "N/A"),
                "registrarName": whois_data.get("registrarName", "N/A"),
                "registrationDate": whois_data.get("createdDate", "N/A"),
                "expirationDate": whois_data.get("expiresDate", "N/A"),
                "domainAge": calculate_domain_age(whois_data.get("createdDate", "")),
                "hostnames": format_hostnames(whois_data.get("nameServers", {}).get("hostNames", []))
            }
        elif data_type == "contact":
            result = {
                "registrantName": whois_data.get("registrant", {}).get("name", "N/A"),
                "technicalContactName": whois_data.get("technicalContact", {}).get("name", "N/A"),
                "administrativeContactName": whois_data.get("administrativeContact", {}).get("name", "N/A"),
                "contactEmail": whois_data.get("contactEmail", "N/A")
            }
        else:
            return jsonify({"error": "Invalid dataType. Must be 'domain' or 'contact'."}), 400

        return jsonify(result)

    except requests.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

def format_hostnames(hostnames):
    if not hostnames:
        return "N/A"
    formatted = ", ".join(hostnames)
    return formatted if len(formatted) <= 25 else formatted[:25] + "..."

if __name__ == '__main__':
    app.run(port=5000, debug=True)
