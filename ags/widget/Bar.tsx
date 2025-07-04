import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { exec, execAsync } from "ags/process"
import { createPoll } from "ags/time"
import { createState, createBinding, For } from "ags"
import Hyprland from "gi://AstalHyprland"
import Tray from "gi://AstalTray"
import Wp from "gi://AstalWp"
import Battery from "gi://AstalBattery"

function Start() {
  return (
    <button
      class="Start"
      onClicked={() => execAsync("wofi")}>
      {"󰣇"}
    </button>
  )
}

function Workspaces() {
  const hypr = Hyprland.get_default()
  const workspaces = createBinding(hypr, "workspaces")
  const findById =
    (id: number) => workspaces((wss) => wss.find((ws) => id === ws.id))
  const focused = createBinding(hypr, "focusedWorkspace")
  const className =
    (id: number) => focused((fws) => id === fws.id ? "focused" : "")

  return (
    <box class="Workspaces">
      {Array.from({length: 10}, (_, i) => i + 1).map((id) =>
        <button
          visible={findById(id)((ws) => ws != undefined)}
          class={className(id)}
          onClicked={() => findById(id).get()!.focus()}
        />
      )}
    </box>
  )
}

function SysTray() {
  function popmenu(item: Tray.TrayItem) {
    const popover = Gtk.PopoverMenu.new_from_model(item.menuModel)
    popover.insert_action_group("dbusmenu", item.actionGroup)
    return popover
  }

  const tray = Tray.get_default()

  return (
    <box class="SysTray">
      <For each={createBinding(tray, "items")}>
        {(item: Tray.TrayItem) =>
          <menubutton>
            {popmenu(item)}
            <image gicon={createBinding(item, "gicon")}/>
          </menubutton>
        }
      </For>
    </box>
  )
}

function AudioSlider() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!

  return (
    <box class="AudioSlider">
      <button onClicked={() => speaker.mute = !speaker.mute}>
        <image iconName={createBinding(speaker, "volumeIcon")} />
      </button>
      <slider
        onChangeValue={({value}) => {speaker.volume = value}}
        value={createBinding(speaker, "volume")}
      />
    </box>
  )
}

function BatteryLevel() {
  const battery = Battery.get_default()
  const percentage = createBinding(battery, "percentage")
  const label = percentage((value) => ` ${Math.floor(value * 100)}%`)
  const [warned, setWarned] = createState(false)
  percentage.subscribe(() => {
    if (percentage.get() <= 0.2) {
      if (!warned.get()) {
        setWarned(true)
        exec(["notify-send", "Low Battery", "Please charge the laptop."])
      }
    } else { setWarned(false) }
  })

  return (
    <box class="Battery">
      <image iconName={createBinding(battery, "batteryIconName")} />
      <label label={label} />
    </box>
  )
}

function Date() {
  const date = createPoll("", 1000,
    "date +'    %Y 年 %-m 月 %-d 日 %A'")
  return (
    <label
      class="Date"
      label={date}
    />
  )
}

function Time() {
  const time = createPoll("", 1000, "date +'󰅐  %p %H:%M'")
  return (
    <label
      class="Time"
      label={time}
    />
  )
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="centerbox">
        <box $type="start">
          <Start />
          <Workspaces />
        </box>
        <box $type="center">
          <Date />
          <Time />
        </box>
        <box $type="end">
          <SysTray />
          <AudioSlider />
          <BatteryLevel />
        </box>
      </centerbox>
    </window>
  )
}

