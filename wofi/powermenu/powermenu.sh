#!/bin/bash

conf=$HOME/.config/wofi/powermenu/config
style=$HOME/.config/wofi/powermenu/style.css
icons='\n\n'
chosen="$(echo -e "$icons" | wofi --conf "$conf" --style "$style")"

case "$chosen" in
    "${icons:0:1}")
        poweroff ;;
    "${icons:3:1}")
        reboot ;;
    "${icons:6:1}")
        hyprctl dispatch exit ;;
esac

