# =========================
# SMART PET FEEDER
# ESP32 + MICROPYTHON + FIREBASE
# UPYCRAFT
# =========================

import network
import socket
import time
import ntptime
import urequests  # Para enviar datos a Firebase
import ujson      # Para formatear los datos JSON

from machine import Pin, RTC

# =========================
# CONFIGURACIÓN FIREBASE
# =========================
# Tu URL exacta con el nodo "/horarios.json" al final para gestionar los datos
FIREBASE_URL = "https://iopet-18608-default-rtdb.firebaseio.com/horarios.json"

# =========================
# WIFI
# =========================
ssid = "Xtrim_Mayorga"
password = "Mayorga0208."

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

print("Conectando WiFi...")

while not wlan.isconnected():
    pass

print("WiFi conectado")
print(wlan.ifconfig())

# =========================
# RTC + INTERNET TIME
# =========================
rtc = RTC()

print("Sincronizando hora...")

try:
    ntptime.settime()
    print("Hora sincronizada correctamente")
except:
    print("No se pudo sincronizar la hora")

# =========================
# PINES
# =========================
pulsador = Pin(4, Pin.IN, Pin.PULL_DOWN)
dispensador = Pin(21, Pin.OUT)

# =========================
# VARIABLES
# =========================
estado = "ESPERANDO"
ultimo_horario = ""

# =========================
# MOSTRAR / CONSULTAR (GET DESDE FIREBASE)
# =========================
def cargar_horarios():
    lista = []
    try:
        # Hacemos un GET a Firebase para traer todos los horarios de la nube
        response = urequests.get(FIREBASE_URL)
        if response.status_code == 200:
            datos = response.json()
            # Firebase devuelve un diccionario ordenado por IDs aleatorios únicos (-OXXXXX)
            if datos is not None:
                for k, v in datos.items():
                    if "hora" in v and v["hora"] not in lista:
                        lista.append(v["hora"])
        response.close()
    except Exception as e:
        print("Error al leer desde Firebase (GET):", e)
        
    return sorted(lista)

# =========================
# ACTIVAR DISPENSADOR
# =========================
def activar_dispensador(origen="MANUAL"):
    global estado
    estado = "SIRVIENDO COMIDA"
    print("ACTIVADO DESDE:", origen)

    dispensador.value(1)
    time.sleep(5)
    dispensador.value(0)

    estado = "COMIDA SERVIDA"
    print("COMIDA SERVIDA")

# =========================
# OBTENER HORA ECUADOR
# =========================
def obtener_hora():
    fecha = rtc.datetime()
    hora = fecha[4]
    minuto = fecha[5]

    # ECUADOR UTC -5
    hora = hora - 5
    if hora < 0:
        hora += 24

    # FORMATO
    hora = "0" + str(hora) if hora < 10 else str(hora)
    minuto = "0" + str(minuto) if minuto < 10 else str(minuto)

    return hora + ":" + minuto

# =========================
# VERIFICAR HORARIOS AUTOMÁTICOS
# =========================
def verificar_horarios():
    global ultimo_horario
    hora_actual = obtener_hora()
    
    # Trae la lista actualizada de Firebase para validar si toca alimentar
    horarios_guardados = cargar_horarios()

    if hora_actual in horarios_guardados:
        if ultimo_horario != hora_actual:
            ultimo_horario = hora_actual
            activar_dispensador("HORARIO " + hora_actual)

# =========================
# GENERAR HORARIOS HTML
# =========================
def generar_horarios_html():
    html = ""
    horarios_guardados = cargar_horarios()

    if len(horarios_guardados) == 0:
        return """
        <div class='schedule-card'>
            <div class='schedule-title'>
                NO HAY HORARIOS CONFIGURADOS
            </div>
        </div>
        """

    for horario in horarios_guardados:
        html += """
        <div class='schedule-card'>
            <div class='schedule-title'>HORA DE COMER</div>
            <div class='schedule-time'>{0}</div>
            <a href="/eliminar?hora={0}" class="btn-delete">ELIMINAR</a>
        </div>
        """.format(horario)

    return html

# =========================
# PAGINA WEB (INTERFAZ)
# =========================
def web_page():
    tarjeta = "on" if dispensador.value() else ""
    horarios_html = generar_horarios_html()
    hora_actual = obtener_hora()

    html = """
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SMART PET FEEDER</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="header">SMART PET FEEDER<small>COMEDERO INTELIGENTE</small></div>

    <div class="container">

        <!-- ── BANNER ── -->
        <div class="banner">
            <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e" alt="Mascota">
            <div class="banner-overlay"></div>
        </div>

        <!-- ── SECCIÓN: ESTADO ── -->
        <div class="section {0}">
            <div class="section-label"><span>&#128240;</span> Estado del sistema</div>
            <div class="status-row">
                <div class="status-badge">WIFI ON</div>
                <div class="clock">&#128338; Hora actual: <strong>{1}</strong></div>
            </div>
            <div class="last-feed">&#128062; &Uacute;ltima comida: --</div>
        </div>

        <!-- ── SECCIÓN: ACCIÓN ── -->
        <div class="section">
            <div class="section-label"><span>&#127858;</span> Alimentar</div>
            <a href="/llenar" class="action-btn">SERVIR COMIDA</a>
        </div>

        <!-- ── SECCIÓN: PROGRAMAR ── -->
        <div class="section">
            <div class="section-label"><span>&#128197;</span> Programar horario</div>
            <div class="form-card">
                <form action="/agregar" method="GET">
                    <div class="form-row">
                        <input type="time" name="hora" class="input-time" required>
                        <button type="submit" class="btn-submit">AGREGAR HORARIO</button>
                    </div>
                </form>
            </div>
            <div class="feed-status">{2}</div>

            <div class="sched-head">
                <h3>Horarios programados</h3>
            </div>
            <div class="sched-list">
                {3}
            </div>
        </div>

        <!-- ── SECCIÓN: EXPORTAR ── -->
        <div class="section">
            <div class="section-label"><span>&#128200;</span> Datos</div>
            <a href="/descargar" class="export-btn">EXPORTAR HORARIOS (CSV)</a>
        </div>

    </div>
</body>

</html>
""".format(tarjeta, hora_actual, estado, horarios_html)
    return html

# =========================
# SERVIDOR WEB
# =========================
tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
tcp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
tcp_socket.bind(('', 80))
tcp_socket.listen(5)
tcp_socket.settimeout(0.1)

print("Servidor iniciado")
print("http://" + wlan.ifconfig()[0])

# =========================
# LOOP PRINCIPAL
# =========================
while True:
    # =========================
    # BOTON FISICO
    # =========================
    if pulsador.value() == 1:
        time.sleep(0.03)
        if pulsador.value() == 1:
            print("BOTON FISICO")
            activar_dispensador("BOTON")
            time.sleep(0.3)

    # =========================
    # HORARIOS AUTOMÁTICOS
    # =========================
    verificar_horarios()

    # =========================
    # WEB SERVER
    # =========================
    try:
        conn, addr = tcp_socket.accept()
        request = conn.recv(1024)
        request = str(request)

        # =========================
        # EXPORTAR Y DESCARGAR CSV
        # =========================
        if "GET /descargar" in request:
            horarios_guardados = cargar_horarios()
            csv_content = "ID,Horario de Alimentacion\n" 
            for index, hora in enumerate(horarios_guardados):
                csv_content += "{},{}\n".format(index + 1, hora)
            
            conn.send("HTTP/1.1 200 OK\n")
            conn.send("Content-Type: text/csv\n") 
            conn.send("Content-Disposition: attachment; filename=horarios_alimentador.csv\n")
            conn.send("Connection: close\n\n")
            
            conn.sendall(csv_content)
            conn.close()
            continue

        # =========================
        # SERVIER CSS
        # =========================
        if "GET /style.css" in request:
            try:
                with open("style.css", "r") as f:
                    css = f.read()
                conn.send("HTTP/1.1 200 OK\n")
                conn.send("Content-Type: text/css\n")
                conn.send("Connection: close\n\n")
                conn.sendall(css)
            except:
                conn.send("HTTP/1.1 404 Not Found\n")
                conn.send("Connection: close\n\n")
            conn.close()
            continue

        redirigir = False

        # =========================
        # ACTIVAR WEB
        # =========================
        if "GET /llenar" in request:
            activar_dispensador("WEB")
            redirigir = True

        # =========================
        # CREAR / AGREGAR (POST A FIREBASE)
        # =========================
        if "GET /agregar?hora=" in request:
            inicio = request.find("hora=") + 5
            dato = request[inicio:]
            fin = dato.find(" ")
            hora = dato[:fin]
            hora = hora.replace("%3A", ":")

            if len(hora) == 5:
                # Comprobamos si la hora ya existe en Firebase para no duplicarla
                if hora not in cargar_horarios():
                    payload = {"hora": hora}
                    # Enviamos un método POST. Firebase creará el registro con un ID automático
                    res = urequests.post(FIREBASE_URL, json=payload)
                    if res.status_code == 200:
                        print("HORARIO GUARDADO EN FIREBASE:", hora)
                    res.close()
            redirigir = True

        # =========================
        # ELIMINAR (DELETE EN FIREBASE)
        # =========================
        if "GET /eliminar?hora=" in request:
            inicio = request.find("hora=") + 5
            dato = request[inicio:]
            fin = dato.find(" ")
            hora = dato[:fin]
            hora = hora.replace("%3A", ":")
            
            try:
                # Firebase requiere el ID interno (-OXXXX) para borrar un dato. Primero consultamos.
                res_get = urequests.get(FIREBASE_URL)
                if res_get.status_code == 200:
                    datos = res_get.json()
                    if datos is not None:
                        for key, value in datos.items():
                            if value.get("hora") == hora:
                                # Cuando encontramos el ID (key) que tiene esa hora, apuntamos directamente a él
                                url_delete = "https://iopet-18608-default-rtdb.firebaseio.com/horarios/{}.json".format(key)
                                # Enviamos el método HTTP DELETE para destruirlo de la nube
                                res_del = urequests.delete(url_delete)
                                if res_del.status_code == 200:
                                    print("HORARIO ELIMINADO DE FIREBASE:", hora)
                                res_del.close()
                res_get.close()
            except Exception as e:
                print("Error al intentar eliminar de Firebase (DELETE):", e)
            redirigir = True

        # =========================
        # ENVIAR RESPUESTA HTTP (REDIRECCIÓN)
        # =========================
        if redirigir:
            conn.send("HTTP/1.1 303 See Other\n")
            conn.send("Location: /\n")
            conn.send("Connection: close\n\n")
        else:
            response = web_page()
            conn.send("HTTP/1.1 200 OK\n")
            conn.send("Content-Type: text/html\n")
            conn.send("Connection: close\n\n")
            conn.sendall(response)
            
        conn.close()

    except Exception as e:
        pass

    time.sleep(0.05)
