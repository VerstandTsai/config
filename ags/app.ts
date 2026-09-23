import app from "ags/gtk4/app"
import style from "./style.scss"
import Launcher from "./widget/Launcher"
import NotifWindow, { notifd } from "./widget/Notif"

app.start({
  css: style,
  main() {
    app.get_monitors().map(Launcher)
    notifd.connect("notified", () => app.get_monitors().map(NotifWindow))
  },
})

