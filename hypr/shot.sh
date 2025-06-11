#!/bin/sh

filename="$HOME/Pictures/screenshots/$(date '+%F-%H-%M-%S').png"

grim -g "$(slurp)" "$filename"
notify-send -i "$filename" 'Screenshot taken' "Picture saved to $filename"

