// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, exit};
use std::str;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn initialize_flatpak() -> String {
    let command = format!("sudo apt install flatpak -y && flatpak --user remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo");
    run_bash_command(&command)
}
#[tauri::command]
fn read_file(filename: &str) -> String { // return file content as a string
    match std::fs::read_to_string(filename) {
        Ok(content) => content,
        Err(e) => e.to_string()
    }
}
// main function to handle commands
fn run_bash_command(command: &str) -> String {
    let output = Command::new("bash")
        .arg("-c")
        .arg(command)
        .output()
        .expect("Failed to execute command");

    if !output.status.success() {
        eprintln!("Error: {}", str::from_utf8(&output.stderr).unwrap());
        exit(1);
    }
    str::from_utf8(&output.stdout).unwrap().to_string()
}

#[tauri::command] // search for a flatpak package
fn search_flatpak( input: &str) -> String {
    let command = format!("flatpak search {}", input);
    run_bash_command(&command)
}

#[tauri::command] // get info about a flatpak package
fn get_info_flatpak( input: &str) -> String {
    let command = format!("flatpak info {}", input);
    run_bash_command(&command)
}

#[tauri::command] // list all installed flatpak packages
fn list_installed_flatpak() -> String {
    let command = "flatpak list";
    run_bash_command(&command)
}

#[tauri::command] // install a flatpak package
fn install_flatpak( input: &str) -> String {
    let command = format!("flatpak install {}", input);
    run_bash_command(&command)
}

// https://docs.flatpak.org/en/latest/flatpak-command-reference.html

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_file, search_flatpak, get_info_flatpak, install_flatpak, list_installed_flatpak, initialize_flatpak])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

