import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createBinding, For } from "ags"
import Notifd from "gi://AstalNotifd"
import Pango from "gi://Pango"

const notifd = Notifd.get_default()
notifd.connect("notified", () => app.get_monitors().map(NotifWindow))

function NotifBox(notif: Notifd.Notification) {
  return (
    <button onClicked={() => notif.dismiss()}>
      <box class="NotifBox" orientation={Gtk.Orientation.VERTICAL}>
        <box class="NotifApp">
          <image iconName={notif.appIcon} pixelSize={32} />
          <label label={notif.appName.toUpperCase()} />
        </box>
        <label class="Summary" label={notif.summary} halign={Gtk.Align.START} />
        <label class="Body" label={notif.body} halign={Gtk.Align.START}
          wrap={true} maxWidthChars={32} lines={4} ellipsize={Pango.EllipsizeMode.END}
        />
      </box>
    </button>
  )
}

function NotifWindow(gdkmonitor: Gdk.Monitor) {
  return (
    <window
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

export default function NotifCenter(gdkmonitor: Gdk.Monitor) {
  let thisWindow: Astal.Window;
  const notifsSorted = createBinding(notifd, "notifications")(
    (notifs) => notifs.sort((a, b) => b.time - a.time)
  )

  return (
    <window
      visible={notifsSorted((notifs) => notifs.length > 0)}
      name="notifcenter"
      class="NotifCenter"
      gdkmonitor={gdkmonitor}
      anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
      application={app}
      $={(self) => {
        thisWindow = self
        self.marginRight = -576
      }}
    >
      <Gtk.EventControllerMotion
        onEnter={() => thisWindow.marginRight = 0}
        onLeave={() => thisWindow.marginRight = -576}
      />
      <scrolledwindow
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
        vscrollbarPolicy={Gtk.PolicyType.EXTERNAL}
      >
        <box orientation={Gtk.Orientation.VERTICAL}>
          <For each={notifsSorted}>
            {(notif) => NotifBox(notif)}
          </For>
        </box>
      </scrolledwindow>
    </window>
  )
}

