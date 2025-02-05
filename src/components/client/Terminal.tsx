"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const dynamicHighlight = (text: string): string => {
  const commandRegex = /^\s*([\w-]+)(?=\s|$)/;
  const optionRegex = /(\s-\w|\s--\w[\w-]*)/g;
  const pathRegex = /(\/[^\s]+)/g;
  const errorRegex = /error|not found|permission denied/gi;
  let styledText = text;
  styledText = styledText.replace(commandRegex, "\x1b[1;97m$1\x1b[0m");
  styledText = styledText.replace(optionRegex, "\x1b[33m$1\x1b[0m");
  styledText = styledText.replace(pathRegex, "\x1b[34m$1\x1b[0m");
  styledText = styledText.replace(errorRegex, "\x1b[31m$&\x1b[0m");
  return styledText;
}

interface TerminalComponentProps {
  setWriteOnTerminal: Dispatch<SetStateAction<Terminal | undefined>>;
}

export const TerminalComponent : React.FC<TerminalComponentProps> = ({ setWriteOnTerminal }) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const termInstance = useRef<Terminal | null>(null);
  useEffect(() => {
    if (!terminalRef.current) return;
    const term = new Terminal({
      rows: 12,
      cols: 60,
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'monospace, "Fira Code", "Courier New"',
      theme: {
        background: "#0d1117",
        foreground: "#dcdcdc",
        cursor: "#00ff00",
        selectionBackground: "#555"
      },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    const originalWrite = term.write;
    term.write = (text: string) => {
      console.log("terminal write", text);
      if (!text) return;
      const styledText = dynamicHighlight(text);
      return originalWrite.call(term, styledText);
    };
    termInstance.current = term;
    setWriteOnTerminal(term);
    term.writeln("\x1b[32mWelcome to WebCode Genie terminal!!\x1b[0m");
    return () => {
      term.dispose();
      setWriteOnTerminal(undefined);
    };
  }, []);

  return <div ref={terminalRef} className="w-full h-40 absolute bottom-0" />;
}
