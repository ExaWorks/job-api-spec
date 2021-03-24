.PHONY: all clean

all: specification.html

clean:
	rm -f specification.html

specification.html: specification.md extras.css extras.js
	commonmarker --render-option=UNSAFE ./specification.md > ./specification.html
