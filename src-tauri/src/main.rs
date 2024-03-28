// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, exit};
use std::str;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn read_file(filename: &str) -> String { // return file content as a string
    match std::fs::read_to_string(filename) {
        Ok(content) => content,
        Err(e) => e.to_string()
    }
}

#[tauri::command]
fn search_flatpak( input: &str) -> String {
    let output = Command::new("bash")
        .arg("search")
        .output()
        .expect("Failed to execute command");

    if !output.status.success() {
        eprintln!("Error: {}", str::from_utf8(&output.stderr).unwrap());
        exit(1);
    }
    str::from_utf8(&output.stdout).unwrap().to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_file, search_flatpak])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

