import re

with open('app.py', 'r') as f:
    content = f.read()

# Pattern replaces trailing parenthesis out of socketio.emit with `, room=user_id)`
content = re.sub(r'socketio\.emit\(\'([^\']+)\',([^)]+)\)', r"socketio.emit('\1',\2, room=user_id)", content)

with open('app.py', 'w') as f:
    f.write(content)
