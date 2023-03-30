import hashlib
import glob
import sys

# THIS IS A TEMPORARY SOLUTION
# See https://github.com/vegaprotocol/vegawallet-desktop/issues/619

if len(sys.argv) != 2:
  print("The network is required as first argument")
  exit(1)

# Retrieve the network for which the application is optimizedFor
optimizedFor = sys.argv[1]

# Only target files that can change the application frontend.
frontendFiles = glob.glob('./frontend/src/**/*.tsx?')
frontendFiles.append('./frontend/yarn.lock')

# Accumulate the formatted content of the frontend files
contentToHash = ''

# Going through all file of interest
for file in frontendFiles:
  with open(file, 'r', encoding="utf-8") as f:
    content = f.read()
    # Remove any characters that could be changed by Git during checkout.
    content.replace('\r\n \t', '')
    contentToHash += content

# Add the network for which the frontend is optimized to ensure we get a
# different hash.
contentToHash += optimizedFor

print("hash="+hashlib.sha256(contentToHash.encode('utf-8')).hexdigest())
