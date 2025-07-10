import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Launcher from "./widget/Launcher"
import Dock from "./widget/Dock"

app.start({
  css: style,
  main() {
    app.get_monitors().map(Bar)
    app.get_monitors().map(Launcher)
    app.get_monitors().map(Dock)
  },
})
