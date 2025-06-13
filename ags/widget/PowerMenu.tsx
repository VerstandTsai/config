import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { exec, Variable } from "astal"

export default function PowerMenu(monitor: Gdk.Monitor) {
  const option = Variable(0)

  return <window
    name="powermenu"
    className="PowerMenu"
    gdkmonitor={monitor}
    application={App}
    layer={Astal.Layer.OVERLAY}
    keymode={Astal.Keymode.ON_DEMAND}
    anchor={Astal.WindowAnchor.NONE}
    setup={(self) => self.hide()}
    onKeyPressEvent={(self, event: Gdk.Event) => {
      switch (event.get_keyval()[1]) {
      case Gdk.KEY_Escape:
        self.hide()
        break
      case Gdk.KEY_Left:
        option.set(((option.get() - 1) % 3 + 3) % 3)
        break
      case Gdk.KEY_Right:
        option.set((option.get() + 1) % 3)
        break
      case Gdk.KEY_Return:
        switch (option.get()) {
        case 0:
          exec("poweroff")
          break
        case 1:
          exec("reboot")
          break
        case 2:
          exec("hyprctl dispatch exit")
          break
        }
        break
      }
    }}>
    <centerbox>
      <button className={option((value) => "PowerOff " + (value == 0 ? "selected" : ""))}></button>
      <button className={option((value) => "Restart " + (value == 1 ? "selected" : ""))}></button>
      <button className={option((value) => "LogOut " + (value == 2 ? "selected" : ""))}></button>
    </centerbox>
  </window>
}
