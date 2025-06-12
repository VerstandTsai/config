import { Variable, bind } from "astal"
import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { execAsync } from "astal/process"
import Hyprland from "gi://AstalHyprland"
import Tray from "gi://AstalTray"
import Wp from "gi://AstalWp"
import Battery from "gi://AstalBattery"

function Start() {
  return <button
    className="Start"
    onClick={() => execAsync("wofi")}>
    {"󰣇"}
  </button>
}

function Workspaces() {
  const hypr = Hyprland.get_default()

  return <box className="Workspaces">
    {bind(hypr, "workspaces").as(wss => wss
      // filter out special workspaces
      .filter(ws => !(ws.id >= -99 && ws.id <= -2))
      .sort((a, b) => a.id - b.id)
      .map(ws => (
        <button
          onClicked={() => ws.focus()}>
          {bind(hypr, "focusedWorkspace").as(fw =>
            ws === fw ? "" : "")}
        </button>
      ))
    )}
  </box>
}

function FocusedClient() {
  const hypr = Hyprland.get_default()
  const focused = bind(hypr, "focusedClient")

  return <box
    className="Focused"
    visible={focused.as(Boolean)}>
    {focused.as(client => (
      client && <label label={bind(client, "title").as(String)} />
    ))}
  </box>
}

function SysTray() {
  const tray = Tray.get_default()

  return <box className="SysTray">
    {bind(tray, "items").as(items => items.map(item => (
      <menubutton
        tooltipMarkup={bind(item, "tooltipMarkup")}
        usePopover={false}
        actionGroup={bind(item, "actionGroup").as(
          ag => ["dbusmenu", ag]
        )}
        menuModel={bind(item, "menuModel")}>
        <icon gicon={bind(item, "gicon")} />
      </menubutton>
    )))}
  </box>
}

function AudioSlider() {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!

    return <box className="AudioSlider" css="min-width: 140px">
      <button onClicked={() => speaker.mute = !speaker.mute}>
        <icon icon={bind(speaker, "volumeIcon")} />
      </button>
      <slider
        hexpand
        onDragged={({ value }) => speaker.volume = value}
        value={bind(speaker, "volume")}
      />
    </box>
}

function BatteryLevel() {
  const bat = Battery.get_default()

  return <box className="Battery"
    visible={bind(bat, "isPresent")}>
    <icon icon={bind(bat, "batteryIconName")} />
    <label label={bind(bat, "percentage").as(p =>
      ` ${Math.floor(p * 100)}%`
    )} />
  </box>
}

function Time() {
  const time = Variable("").poll(1000,
    "date +'%Y 年 %-m 月 %-d 日 %A %p %H:%M'")
  return <label
    className="Time"
    label={time()}
  />
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return <window
    className="Bar"
    gdkmonitor={gdkmonitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={TOP | LEFT | RIGHT}
    application={App}>
    <centerbox>
      <box>
        <Start/>
        <Workspaces/>
      </box>
      <box>
        <FocusedClient/>
      </box>
      <box halign={Gtk.Align.END}>
        <SysTray/>
        <AudioSlider/>
        <BatteryLevel/>
        <Time/>
      </box>
    </centerbox>
  </window>
}
