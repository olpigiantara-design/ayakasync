/* ============================================================
   TERMINAL.JS — Sistem log terminal
============================================================ */

function log(msg, type = "info") {
  const terminalContent = document.getElementById("terminalContent");
  const terminalBox = document.getElementById("terminal");
  if (!terminalContent || !terminalBox) return;

  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  let colorClass = "log-info";
  if (type === "success") colorClass = "log-success";
  if (type === "error")   colorClass = "log-error";
  if (type === "warn")    colorClass = "log-warn";

  const line = document.createElement("div");
  line.className = "log-line";
  line.innerHTML = `<span class="log-time">[${time}]</span> <span class="${colorClass}">${msg}</span>`;

  terminalContent.appendChild(line);
  terminalBox.scrollTop = terminalBox.scrollHeight;
}