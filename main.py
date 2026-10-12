from flask import Flask
import re
import json
import csv
import sqlite3
import os




app = Flask(__name__)




if __name__=="__main__":
    app.run(debug=True)