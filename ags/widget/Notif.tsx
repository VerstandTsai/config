import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import Pango from "gi://Pango"

export const notifd = Notifd.get_default()

function NotifBox(notif: Notifd.Notification) {
  const notifDate = new Date(notif.time * 1000);
  const hour = notifDate.getHours().toString().padStart(2, "0")
  const minute = notifDate.getMinutes().toString().padStart(2, "0")

  return (
    <box class="NotifBox" orientation={Gtk.Orientation.VERTICAL}>
      <centerbox class="NotifMeta">
        <box $type="start" class="NotifApp">
          <image iconName={notif.appName.toLowerCase()} pixelSize={24} />
          <label label={notif.appName.toUpperCase()} />
        </box>
        <box $type="center" />
        <label $type="end" class="NotifTime" label={`${hour}:${minute}`} />
      </centerbox>
      <label class="Summary" label={notif.summary} halign={Gtk.Align.START} />
      <label class="Body" label={notif.body} halign={Gtk.Align.START}
        wrap={true} maxWidthChars={32} lines={4} ellipsize={Pango.EllipsizeMode.END}
      />
    </box>
  )
}

export default function NotifWindow(gdkmonitor: Gdk.Monitor) {
  return (
    <window
      layer={Astal.Layer.OVERLAY}
      visible
      name="notifwindow"
      class="NotifWindow"
      gdkmonitor={gdkmonitor}
      anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.TOP}
      application={app}
      $={(self) => {
        setTimeout(() => self.close(), 3000)
        notifd.connect("notified", () => self.marginTop += 192)
      }}
    >
      {NotifBox(notifd.notifications.reduce((max, cur) => cur.time > max.time ? cur : max))}
    </window>
  )
}

