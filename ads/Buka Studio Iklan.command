#!/bin/bash
cd "$(dirname "$0")"
pip3 install -q pillow 2>/dev/null
python3 app.py
