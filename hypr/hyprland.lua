hl.monitor({
  output = "",
  mode = "preferred",
  position = "auto",
  scale = "1"
})

local terminal = "ghostty --gtk-single-instance=true"
local menu = "ags toggle launcher"

hl.on("hyprland.start", function ()
  hl.exec_cmd("systemctl --user start hyprland-session.target")
  hl.exec_cmd("hyprlock")
  hl.exec_cmd(terminal .. " --quit-after-last-window-closed=false --initial-window=false")
  hl.exec_cmd("kitten panel --layer top -o window_padding_width=4 zsh -c 'status-bar $COLUMNS'")
  hl.exec_cmd("kitten panel --edge background sh -c 'kitten icat -n ~/.wallpaper && echo -e \"\\x1b[3+T\" && sleep infinity'")
  hl.exec_cmd("ags run")
  hl.exec_cmd("udiskie -s")
  hl.exec_cmd("fcitx5")
  hl.exec_cmd("thunderbird", { workspace = 1 })
  hl.exec_cmd("discord --ozone-platform=wayland --enable-wayland-ime", { workspace = 2 })
  hl.exec_cmd("firefox", { workspace = 3 })
end)

hl.on("hyprland.shutdown", function()
  os.execute("systemctl --user stop hyprland-session.target && sleep 0.1")
end)

local local_bin = ":" .. os.getenv("HOME") .. "/.local/bin"
local cargo_bin = ":" .. os.getenv("HOME") .. "/.cargo/bin"
hl.env("PATH", os.getenv("PATH") .. cargo_bin .. local_bin)
hl.env("LANG", "zh_TW.UTF-8")
hl.env("GSK_RENDERER", "vulkan")
hl.env("QT_QPA_PLATFORMTHEME", "qt5ct")
hl.env("XCURSOR_THEME", "capitaine-cursors-light")
hl.env("XCURSOR_SIZE", "24")
hl.env("TERMINAL", terminal)
hl.env("EDITOR", "nvim")
hl.env("BROWSER", "firefox")

hl.config({
  general = {
    gaps_in = 16,
    gaps_out = 32,
    border_size = 1,
    col = {
      active_border = "rgba(ccccccaa)",
      inactive_border = "rgba(cccccc55)",
    },
    resize_on_border = true,
    layout = "dwindle",
  },
  decoration = {
    rounding = 8,
    shadow = { enabled = false },
    blur = { passes = 3 },
  },
  dwindle = {
    force_split = 2,
    default_split_ratio = 1.23,
  },
  misc = {
    focus_on_activate = true,
    force_default_wallpaper = 0,
    disable_hyprland_logo = true,
  },
  input = {
    sensitivity = 0.5,
    accel_profile = "flat",
    touchpad = {
      natural_scroll = true,
      scroll_factor = 0.2,
    }
  },
  gestures = {
    workspace_swipe_direction_lock = false,
    workspace_swipe_forever = true,
    workspace_swipe_use_r = true,
  },
})

hl.gesture({
  fingers = 3,
  direction = "horizontal",
  action = "workspace"
})

hl.curve("ease", { type = "bezier", points = { {0.2, 0}, {0, 1} } })
hl.curve("easeOut", { type = "bezier", points = { {0.05, 0.7}, {0.1, 1} } })
hl.curve("easeIn", { type = "bezier", points = { {0.3, 0}, {0.8, 0.15} } })

hl.animation({ leaf = "global", enabled = true, speed = 5, bezier = "ease" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 5, bezier = "ease", style = "slide" })
hl.animation({ leaf = "windowsIn", enabled = true, speed = 4, bezier = "easeOut", style = "slide" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 2, bezier = "easeIn", style = "slide" })
hl.animation({ leaf = "layersIn", enabled = true, speed = 4, bezier = "easeOut", style = "slide" })
hl.animation({ leaf = "layersOut", enabled = true, speed = 2, bezier = "easeIn", style = "slide" })

hl.workspace_rule({ workspace = "w[tv1]", gaps_out = 0, gaps_in = 0 })
hl.workspace_rule({ workspace = "f[1]", gaps_out = 0, gaps_in = 0 })
hl.window_rule({
    name  = "no-gaps-wtv1",
    match = { float = false, workspace = "w[tv1]" },
    border_size = 0,
    rounding    = 0,
})
hl.window_rule({
    name  = "no-gaps-f1",
    match = { float = false, workspace = "f[1]" },
    border_size = 0,
    rounding    = 0,
})

local mainMod = "SUPER"
hl.bind(mainMod .. " + return", hl.dsp.exec_cmd(terminal))
hl.bind(mainMod .. " + O", hl.dsp.exec_cmd(menu))
hl.bind(mainMod .. " + S", hl.dsp.exec_cmd("shot"))
hl.bind(mainMod .. " + R", hl.dsp.exec_cmd("pkill gjs; ags run"))
hl.bind(mainMod .. " + C", hl.dsp.exec_cmd("hyprpicker"))
hl.bind(mainMod .. " + M", hl.dsp.exit())
hl.bind(mainMod .. " + Q", hl.dsp.window.close())
hl.bind(mainMod .. " + F", hl.dsp.window.fullscreen())
hl.bind(mainMod .. " + V", hl.dsp.window.float({ action = "toggle" }))
hl.bind(mainMod .. " + H", hl.dsp.focus({ direction = "left" }))
hl.bind(mainMod .. " + J", hl.dsp.focus({ direction = "down" }))
hl.bind(mainMod .. " + K", hl.dsp.focus({ direction = "up" }))
hl.bind(mainMod .. " + L", hl.dsp.focus({ direction = "right" }))
hl.bind(mainMod .. " + CTRL + H", hl.dsp.window.resize({ x = -20, y = 0, relative = true }))
hl.bind(mainMod .. " + CTRL + J", hl.dsp.window.resize({ x = 0, y = 20, relative = true }))
hl.bind(mainMod .. " + CTRL + K", hl.dsp.window.resize({ x = 0, y = -20, relative = true }))
hl.bind(mainMod .. " + CTRL + L", hl.dsp.window.resize({ x = 20, y = 0, relative = true }))
hl.bind(mainMod .. " + SHIFT + H", hl.dsp.window.swap({ direction = "left" }))
hl.bind(mainMod .. " + SHIFT + J", hl.dsp.window.swap({ direction = "down" }))
hl.bind(mainMod .. " + SHIFT + K", hl.dsp.window.swap({ direction = "up" }))
hl.bind(mainMod .. " + SHIFT + L", hl.dsp.window.swap({ direction = "right" }))
hl.bind(mainMod .. " + U", hl.dsp.focus({ workspace = "-1" }))
hl.bind(mainMod .. " + I", hl.dsp.focus({ workspace = "+1" }))
hl.bind(mainMod .. " + SHIFT + U", hl.dsp.window.move({ workspace = "-1" }))
hl.bind(mainMod .. " + SHIFT + I", hl.dsp.window.move({ workspace = "+1" }))
hl.bind("XF86AudioRaiseVolume",  hl.dsp.exec_cmd("wpctl set-volume -l 1 @DEFAULT_AUDIO_SINK@ 5%+"), { locked = true, repeating = true })
hl.bind("XF86AudioLowerVolume",  hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"),      { locked = true, repeating = true })
hl.bind("XF86AudioMute",         hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"),     { locked = true, repeating = true })
hl.bind("XF86AudioMicMute",      hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SOURCE@ toggle"),   { locked = true, repeating = true })
hl.bind("XF86MonBrightnessUp",   hl.dsp.exec_cmd("brightnessctl -e4 -n2 set 5%+"),                  { locked = true, repeating = true })
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd("brightnessctl -e4 -n2 set 5%-"),                  { locked = true, repeating = true })
hl.bind("switch:off:Lid Switch", hl.dsp.exec_cmd("hyprlock"), { locked = true })
for i = 1, 10 do
  local key = i % 10
  hl.bind(mainMod .. " + " .. key, hl.dsp.focus({ workspace = i }))
  hl.bind(mainMod .. " + SHIFT + " .. key, hl.dsp.window.move({ workspace = i }))
end

hl.window_rule({
  name = "fullscreen-apps",
  match = {
    class = "^((東方紅魔郷)|(th[0-9]+))\\.exe$",
    fullscreen = true
  }
})

hl.layer_rule({ match = { namespace = "selection" }, no_anim = true })
hl.layer_rule({ match = { namespace = "hyprpicker" }, no_anim = true })
hl.layer_rule({ match = { namespace = "kitty-panel" }, blur = true })
hl.layer_rule({ match = { namespace = "gtk4-layer-shell" }, blur = true })
hl.layer_rule({ match = { namespace = "gtk4-layer-shell" }, blur_popups = true })
hl.layer_rule({ match = { namespace = "gtk4-layer-shell" }, ignore_alpha = 0.2 })

