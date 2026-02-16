import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Launcher from "./widget/Launcher"
import Wallpaper from "./widget/Wallpaper"
import NotifWindow, { notifd } from "./widget/Notif"

app.start({
  css: style,
  main() {
    app.get_monitors().map(Wallpaper)
    app.get_monitors().map(Bar)
    app.get_monitors().map(Launcher)
    notifd.connect("notified", () => app.get_monitors().map(NotifWindow))
  },
})

