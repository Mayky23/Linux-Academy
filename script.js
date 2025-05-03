// Añade al inicio del JS:
function showLevelCompleteModal(levelName) {
    const modal = document.createElement('div');
    modal.className = 'level-complete-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>¡Felicidades!</h3>
            <p>Has completado el nivel ${levelName}</p>
            <p>Tu FLAG para el siguiente nivel es:</p>
            <div class="flag-display">${LEVELS_CONFIG[currentLevel].flag}</div>
            <button id="continue-btn">Continuar</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('continue-btn').addEventListener('click', () => {
        modal.remove();
        clearTerminal();
        showFlagModal();
    });
    
    // Limpiar terminal
    clearTerminal();
}

// Añade este CSS:
const style = document.createElement('style');
style.textContent = `
.level-complete-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.level-complete-modal .modal-content {
    background: var(--menu-bg);
    padding: 2rem;
    border-radius: 5px;
    text-align: center;
    max-width: 500px;
}
.level-complete-modal .flag-display {
    font-family: monospace;
    background: var(--terminal-bg);
    padding: 1rem;
    margin: 1rem 0;
    border: 1px dashed var(--accent-color);
}
.level-complete-modal button {
    background: var(--accent-color);
    color: var(--bg-color);
    border: none;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    border-radius: 3px;
    cursor: pointer;
    margin-top: 1rem;
}
`;
document.head.appendChild(style);


// Generador de flags aleatorias de 10 caracteres alfanuméricos
function generateFlag() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let flag = 'FLAG_';
    for (let i = 0; i < 5; i++) {
        flag += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return flag;
}

function levelCompleted() {
    const levelConfig = LEVELS_CONFIG[currentLevel];
    
    if (!earnedFlags.includes(levelConfig.flag)) {
        earnedFlags.push(levelConfig.flag);
        saveProgress();
        
        // Mostrar modal de felicitaciones
        showLevelCompleteModal(levelConfig.name);
    }
    
    updateProgress();
}

// Configuración de niveles con flags generadas dinámicamente
const LEVELS_CONFIG = {
    basic: {
        name: "Básico",
        flag: generateFlag(),
        requiredCmdCount: 24   // Hasta aquí termina básico
    },
    intermediate: {
        name: "Intermedio",
        flag: generateFlag(),
        requiredCmdCount: 50   // Hasta aquí termina intermedio (24 + 26)
    },
    advanced: {
        name: "Avanzado",
        flag: generateFlag(),
        requiredCmdCount: 86   // Hasta aquí termina avanzado (50 + 36)
    }
};


// Orden de los niveles
const LEVEL_ORDER = ["basic", "intermediate", "advanced"];

// Datos de los comandos por nivel
const commandData = {
    basic: [
        {
            command: "ls",
            title: "Comando: ls",
            description: "Lista los archivos y directorios en el directorio actual.",
            task: "Lista los archivos en el directorio actual.",
            expectedCmd: /^ls(\s+-[a-zA-Z]+)*$/,
            output: "documentos/  imagenes/  musica/  videos/  archivo.txt",
            hint: "Escribe 'ls' y presiona Enter."
        },
        {
            command: "cd",
            title: "Comando: cd",
            description: "Cambia el directorio de trabajo actual.",
            task: "Cambia al directorio 'documentos'.",
            expectedCmd: /^cd\s+documentos\/?$/,
            output: "",
            onSuccess: function() {
                document.getElementById('prompt').textContent = "usuario@linux:~/documentos$";
            },
            hint: "Escribe 'cd documentos' y presiona Enter."
        },
        {
            command: "pwd",
            title: "Comando: pwd",
            description: "Muestra la ruta completa del directorio actual.",
            task: "Muestra tu directorio actual.",
            expectedCmd: /^pwd$/,
            output: "/home/usuario",
            hint: "Escribe 'pwd' y presiona Enter."
        },
        {
            command: "echo",
            title: "Comando: echo",
            description: "Muestra texto o variables en la terminal.",
            task: "Muestra el texto 'Hola Mundo'.",
            expectedCmd: /^echo\s+"?Hola Mundo"?$/,
            output: "Hola Mundo",
            hint: "Escribe 'echo \"Hola Mundo\"' y presiona Enter."
        },
        {
            command: "cat",
            title: "Comando: cat",
            description: "Muestra el contenido de archivos.",
            task: "Muestra el contenido de 'archivo.txt'.",
            expectedCmd: /^cat\s+archivo\.txt$/,
            output: "Este es el contenido del archivo.\nSegunda línea del archivo.",
            hint: "Escribe 'cat archivo.txt' y presiona Enter."
        },
        {
            command: "cp",
            title: "Comando: cp",
            description: "Copia archivos o directorios.",
            task: "Copia 'archivo.txt' a 'archivo_copia.txt'.",
            expectedCmd: /^cp\s+archivo\.txt\s+archivo_copia\.txt$/,
            output: "",
            hint: "Escribe 'cp archivo.txt archivo_copia.txt' y presiona Enter."
        },
        {
            command: "mv",
            title: "Comando: mv",
            description: "Mueve o renombra archivos y directorios.",
            task: "Renombra 'archivo.txt' a 'documento.txt'.",
            expectedCmd: /^mv\s+archivo\.txt\s+documento\.txt$/,
            output: "",
            hint: "Escribe 'mv archivo.txt documento.txt' y presiona Enter."
        },
        {
            command: "rm",
            title: "Comando: rm",
            description: "Elimina archivos o directorios.",
            task: "Elimina 'archivo_copia.txt'.",
            expectedCmd: /^rm\s+archivo_copia\.txt$/,
            output: "",
            hint: "Escribe 'rm archivo_copia.txt' y presiona Enter."
        },
        {
            command: "mkdir",
            title: "Comando: mkdir",
            description: "Crea nuevos directorios.",
            task: "Crea el directorio 'proyectos'.",
            expectedCmd: /^mkdir\s+proyectos$/,
            output: "",
            hint: "Escribe 'mkdir proyectos' y presiona Enter."
        },
        {
            command: "rmdir",
            title: "Comando: rmdir",
            description: "Elimina directorios vacíos.",
            task: "Elimina el directorio vacío 'temporal'.",
            expectedCmd: /^rmdir\s+temporal$/,
            output: "",
            hint: "Escribe 'rmdir temporal' y presiona Enter."
        },
        {
            command: "touch",
            title: "Comando: touch",
            description: "Crea archivos vacíos o actualiza su marca de tiempo.",
            task: "Crea un archivo vacío llamado 'nuevo.txt'.",
            expectedCmd: /^touch\s+nuevo\.txt$/,
            output: "",
            hint: "Escribe 'touch nuevo.txt' y presiona Enter."
        },
        {
            command: "man",
            title: "Comando: man",
            description: "Muestra el manual de un comando.",
            task: "Consulta el manual del comando 'ls'.",
            expectedCmd: /^man\s+ls$/,
            output: "LS(1)                    User Commands                   LS(1)\n\nNAME\n       ls - list directory contents\n\nSYNOPSIS\n       ls [OPTION]... [FILE]...",
            hint: "Escribe 'man ls' y presiona Enter."
        },
        {
            command: "whoami",
            title: "Comando: whoami",
            description: "Muestra el nombre del usuario actual.",
            task: "Muestra tu nombre de usuario.",
            expectedCmd: /^whoami$/,
            output: "usuario",
            hint: "Escribe 'whoami' y presiona Enter."
        },
        {
            command: "exit",
            title: "Comando: exit",
            description: "Cierra la sesión actual de terminal.",
            task: "Cierra la sesión de terminal.",
            expectedCmd: /^exit$/,
            output: "Cerrando sesión...",
            hint: "Escribe 'exit' y presiona Enter."
        },
        {
            command: "history",
            title: "Comando: history",
            description: "Muestra el historial de comandos ejecutados.",
            task: "Muestra tu historial de comandos.",
            expectedCmd: /^history$/,
            output: "1  ls\n2  cd documentos\n3  pwd\n4  clear\n5  echo \"Hola Mundo\"",
            hint: "Escribe 'history' y presiona Enter."
        },
        {
            command: "uname",
            title: "Comando: uname",
            description: "Muestra información básica del sistema.",
            task: "Muestra información del kernel.",
            expectedCmd: /^uname\s+-a$/,
            output: "Linux ubuntu 5.4.0-42-generic #46-Ubuntu SMP Fri Jul 10 00:24:02 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux",
            hint: "Escribe 'uname -a' y presiona Enter."
        },
        {
            command: "df",
            title: "Comando: df",
            description: "Muestra el espacio usado en los sistemas de archivos.",
            task: "Muestra el espacio en disco en formato legible.",
            expectedCmd: /^df\s+-h$/,
            output: "Filesystem      Size  Used Avail Use% Mounted on\nudev            3.9G     0  3.9G   0% /dev\ntmpfs           798M  1.6M  796M   1% /run",
            hint: "Escribe 'df -h' y presiona Enter."
        },
        {
            command: "du",
            title: "Comando: du",
            description: "Muestra el uso de espacio de archivos/directorios.",
            task: "Muestra el tamaño del directorio 'documentos'.",
            expectedCmd: /^du\s+-sh\s+documentos$/,
            output: "4.0K    documentos",
            hint: "Escribe 'du -sh documentos' y presiona Enter."
        },
        {
            command: "date",
            title: "Comando: date",
            description: "Muestra o establece la fecha y hora del sistema.",
            task: "Muestra la fecha y hora actual.",
            expectedCmd: /^date$/,
            output: "Mon Aug 16 14:30:22 UTC 2021",
            hint: "Escribe 'date' y presiona Enter."
        },
        {
            command: "uptime",
            title: "Comando: uptime",
            description: "Muestra el tiempo que lleva encendido el sistema.",
            task: "Muestra el tiempo de actividad del sistema.",
            expectedCmd: /^uptime$/,
            output: "14:31:10 up 2 days,  3:45,  2 users,  load average: 0.15, 0.10, 0.05",
            hint: "Escribe 'uptime' y presiona Enter."
        },
        {
            command: "free",
            title: "Comando: free",
            description: "Muestra el uso de memoria RAM.",
            task: "Muestra la memoria en formato legible.",
            expectedCmd: /^free\s+-h$/,
            output: "              total        used        free      shared  buff/cache   available\nMem:          7.7Gi       1.2Gi       4.8Gi       123Mi       1.7Gi       6.1Gi\nSwap:         2.0Gi          0B       2.0Gi",
            hint: "Escribe 'free -h' y presiona Enter."
        },
        {
            command: "top",
            title: "Comando: top",
            description: "Muestra procesos en tiempo real.",
            task: "Abre el monitor de procesos.",
            expectedCmd: /^top$/,
            output: "top - 14:32:45 up 2 days,  3:47,  2 users,  load average: 0.08, 0.09, 0.05\ntasks: 210 total,   1 running, 209 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  1.0 us,  0.3 sy,  0.0 ni, 98.7 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st",
            hint: "Escribe 'top' y presiona Enter."
        },
        {
            command: "ps",
            title: "Comando: ps",
            description: "Muestra los procesos activos.",
            task: "Muestra todos tus procesos.",
            expectedCmd: /^ps\s+-aux$/,
            output: "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.0 168020 11500 ?        Ss   Aug14   0:03 /sbin/init splash\nroot         2  0.0  0.0      0     0 ?        S    Aug14   0:00 [kthreadd]",
            hint: "Escribe 'ps -aux' y presiona Enter."
        }
    ],
    intermediate: [
        {
            command: "chmod",
            title: "Comando: chmod",
            description: "Cambia los permisos de archivos/directorios.",
            task: "Da permisos de ejecución (x) al archivo 'script.sh'.",
            expectedCmd: /^chmod\s+[+]?[x]\s+script\.sh$/,
            output: "",
            hint: "Escribe 'chmod +x script.sh' y presiona Enter."
        },
        {
            command: "chown",
            title: "Comando: chown",
            description: "Cambia el propietario y grupo de archivos/directorios.",
            task: "Cambia el propietario de 'archivo.txt' a 'usuario2' y grupo a 'developers'.",
            expectedCmd: /^chown\s+usuario2:developers\s+archivo\.txt$/,
            output: "",
            hint: "Escribe 'chown usuario2:developers archivo.txt' y presiona Enter."
        },
        {
            command: "find",
            title: "Comando: find",
            description: "Busca archivos/directorios en el sistema de archivos.",
            task: "Busca todos los archivos .txt en el directorio actual.",
            expectedCmd: /^find\s+\.\s+-name\s+"\*\.txt"$/,
            output: "./documento.txt\n./notas.txt",
            hint: "Escribe 'find . -name \"*.txt\"' y presiona Enter."
        },
        {
            command: "locate",
            title: "Comando: locate",
            description: "Busca archivos rápidamente en la base de datos.",
            task: "Busca el archivo 'config.ini' en todo el sistema.",
            expectedCmd: /^locate\s+config\.ini$/,
            output: "/etc/app/config.ini\n/var/lib/config.ini",
            hint: "Escribe 'locate config.ini' y presiona Enter."
        },
        {
            command: "grep",
            title: "Comando: grep",
            description: "Busca patrones de texto en archivos.",
            task: "Busca la palabra 'error' en el archivo 'log.txt'.",
            expectedCmd: /^grep\s+"error"\s+log\.txt$/,
            output: "2023-01-15 10:30:22 [ERROR] Connection failed",
            hint: "Escribe 'grep \"error\" log.txt' y presiona Enter."
        },
        {
            command: "tar",
            title: "Comando: tar",
            description: "Comprime/descomprime archivos en formato .tar.",
            task: "Comprime el directorio 'documentos' en 'backup.tar'.",
            expectedCmd: /^tar\s+-cvf\s+backup\.tar\s+documentos$/,
            output: "documentos/\ndocumentos/archivo1.txt",
            hint: "Escribe 'tar -cvf backup.tar documentos' y presiona Enter."
        },
        {
            command: "gzip",
            title: "Comando: gzip",
            description: "Comprime archivos usando compresión gzip.",
            task: "Comprime 'backup.tar' en 'backup.tar.gz'.",
            expectedCmd: /^gzip\s+backup\.tar$/,
            output: "",
            hint: "Escribe 'gzip backup.tar' y presiona Enter."
        },
        {
            command: "gunzip",
            title: "Comando: gunzip",
            description: "Descomprime archivos .gz.",
            task: "Descomprime 'backup.tar.gz'.",
            expectedCmd: /^gunzip\s+backup\.tar\.gz$/,
            output: "",
            hint: "Escribe 'gunzip backup.tar.gz' y presiona Enter."
        },
        {
            command: "zip",
            title: "Comando: zip",
            description: "Comprime archivos en formato .zip.",
            task: "Comprime 'documentos' en 'docs.zip'.",
            expectedCmd: /^zip\s+-r\s+docs\.zip\s+documentos$/,
            output: "adding: documentos/ (stored 0%)\nadding: documentos/archivo1.txt (stored 0%)",
            hint: "Escribe 'zip -r docs.zip documentos' y presiona Enter."
        },
        {
            command: "unzip",
            title: "Comando: unzip",
            description: "Descomprime archivos .zip.",
            task: "Descomprime 'docs.zip' en el directorio actual.",
            expectedCmd: /^unzip\s+docs\.zip$/,
            output: "Archive:  docs.zip\ncreating: documentos/\nextracting: documentos/archivo1.txt",
            hint: "Escribe 'unzip docs.zip' y presiona Enter."
        },
        {
            command: "kill",
            title: "Comando: kill",
            description: "Termina procesos por ID de proceso (PID).",
            task: "Termina el proceso con PID 1234.",
            expectedCmd: /^kill\s+1234$/,
            output: "",
            hint: "Escribe 'kill 1234' y presiona Enter."
        },
        {
            command: "killall",
            title: "Comando: killall",
            description: "Termina procesos por nombre.",
            task: "Termina todos los procesos de 'firefox'.",
            expectedCmd: /^killall\s+firefox$/,
            output: "",
            hint: "Escribe 'killall firefox' y presiona Enter."
        },
        {
            command: "xargs",
            title: "Comando: xargs",
            description: "Ejecuta comandos con argumentos desde la entrada estándar.",
            task: "Elimina todos los archivos listados en 'archivos_a_borrar.txt'.",
            expectedCmd: /^cat\s+archivos_a_borrar\.txt\s+\|\s+xargs\s+rm$/,
            output: "",
            hint: "Escribe 'cat archivos_a_borrar.txt | xargs rm' y presiona Enter."
        },
        {
            command: "diff",
            title: "Comando: diff",
            description: "Compara archivos línea por línea.",
            task: "Compara 'archivo1.txt' con 'archivo2.txt'.",
            expectedCmd: /^diff\s+archivo1\.txt\s+archivo2\.txt$/,
            output: "3c3\n< línea original\n---\n> línea modificada",
            hint: "Escribe 'diff archivo1.txt archivo2.txt' y presiona Enter."
        },
        {
            command: "nano",
            title: "Comando: nano",
            description: "Editor de texto simple en terminal.",
            task: "Abre 'config.txt' en el editor nano.",
            expectedCmd: /^nano\s+config\.txt$/,
            output: "GNU nano 5.4                     config.txt\n\n[ Contenido del archivo... ]\n\n^G Get Help   ^O Write Out   ^W Where Is   ^K Cut Text   ^J Justify",
            hint: "Escribe 'nano config.txt' y presiona Enter."
        },
        {
            command: "vim",
            title: "Comando: vim",
            description: "Editor de texto avanzado.",
            task: "Abre 'script.sh' en el editor vim.",
            expectedCmd: /^vim\s+script\.sh$/,
            output: "~                                                                               \n~                                                                               \n~                                                                               \n\"script.sh\" [New File]",
            hint: "Escribe 'vim script.sh' y presiona Enter."
        },
        {
            command: "alias",
            title: "Comando: alias",
            description: "Crea atajos para comandos.",
            task: "Crea un alias 'll' para 'ls -la'.",
            expectedCmd: /^alias\s+ll\s*=\s*'ls\s+-la'$/,
            output: "",
            hint: "Escribe 'alias ll='ls -la'' y presiona Enter."
        },
        {
            command: "wget",
            title: "Comando: wget",
            description: "Descarga archivos de internet.",
            task: "Descarga 'https://example.com/file.zip'.",
            expectedCmd: /^wget\s+https:\/\/example\.com\/file\.zip$/,
            output: "--2023-01-15 10:30:22--  https://example.com/file.zip\nResolving example.com... 93.184.216.34\nConnecting to example.com|93.184.216.34|:443... connected.",
            hint: "Escribe 'wget https://example.com/file.zip' y presiona Enter."
        },
        {
            command: "curl",
            title: "Comando: curl",
            description: "Realiza peticiones HTTP/HTTPS.",
            task: "Obtén el contenido de 'https://example.com'.",
            expectedCmd: /^curl\s+https:\/\/example\.com$/,
            output: "<!doctype html>\n<html>\n<head>\n    <title>Example Domain</title>",
            hint: "Escribe 'curl https://example.com' y presiona Enter."
        },
        {
            command: "head",
            title: "Comando: head",
            description: "Muestra las primeras líneas de un archivo.",
            task: "Muestra las primeras 10 líneas de 'log.txt'.",
            expectedCmd: /^head\s+-n\s+10\s+log\.txt$/,
            output: "2023-01-15 10:30:22 [INFO] Starting service\n2023-01-15 10:30:25 [INFO] Loading configuration\n...",
            hint: "Escribe 'head -n 10 log.txt' y presiona Enter."
        },
        {
            command: "tail",
            title: "Comando: tail",
            description: "Muestra las últimas líneas de un archivo.",
            task: "Muestra las últimas 5 líneas de 'log.txt'.",
            expectedCmd: /^tail\s+-n\s+5\s+log\.txt$/,
            output: "2023-01-15 10:45:00 [INFO] New connection\n2023-01-15 10:45:30 [INFO] Closing connection",
            hint: "Escribe 'tail -n 5 log.txt' y presiona Enter."
        },
        {
            command: "stat",
            title: "Comando: stat",
            description: "Muestra metadatos detallados de archivos.",
            task: "Muestra información detallada de 'archivo.txt'.",
            expectedCmd: /^stat\s+archivo\.txt$/,
            output: "  File: archivo.txt\n  Size: 1024       Blocks: 8          IO Block: 4096   regular file\nDevice: 802h/2050d Inode: 12345678    Links: 1",
            hint: "Escribe 'stat archivo.txt' y presiona Enter."
        },
        {
            command: "mount",
            title: "Comando: mount",
            description: "Monta sistemas de archivos.",
            task: "Lista todos los sistemas de archivos montados.",
            expectedCmd: /^mount$/,
            output: "sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)\nproc on /proc type proc (rw,nosuid,nodev,noexec,relatime)",
            hint: "Escribe 'mount' y presiona Enter."
        },
        {
            command: "umount",
            title: "Comando: umount",
            description: "Desmonta sistemas de archivos.",
            task: "Desmonta el dispositivo '/dev/sdb1'.",
            expectedCmd: /^umount\s+\/dev\/sdb1$/,
            output: "",
            hint: "Escribe 'umount /dev/sdb1' y presiona Enter."
        },
        {
            command: "lsblk",
            title: "Comando: lsblk",
            description: "Lista dispositivos de bloques.",
            task: "Lista todos los dispositivos de bloques.",
            expectedCmd: /^lsblk$/,
            output: "NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT\nsda      8:0    0 465.8G  0 disk\n├─sda1   8:1    0   512M  0 part /boot/efi",
            hint: "Escribe 'lsblk' y presiona Enter."
        },
        {
            command: "blkid",
            title: "Comando: blkid",
            description: "Muestra UUIDs de particiones.",
            task: "Muestra los UUIDs de todos los dispositivos.",
            expectedCmd: /^blkid$/,
            output: "/dev/sda1: UUID=\"1234-5678\" TYPE=\"vfat\"\n/dev/sda2: UUID=\"abcd-efgh-ijkl-mnop\" TYPE=\"ext4\"",
            hint: "Escribe 'blkid' y presiona Enter."
        },
        {
            command: "crontab",
            title: "Comando: crontab",
            description: "Programa tareas automáticas.",
            task: "Lista tus tareas cron programadas.",
            expectedCmd: /^crontab\s+-l$/,
            output: "# m h  dom mon dow   command\n0 3 * * * /usr/bin/backup.sh",
            hint: "Escribe 'crontab -l' y presiona Enter."
        },
        {
            command: "systemctl",
            title: "Comando: systemctl",
            description: "Controla servicios del sistema (systemd).",
            task: "Verifica el estado del servicio 'nginx'.",
            expectedCmd: /^systemctl\s+status\s+nginx$/,
            output: "● nginx.service - A high performance web server and a reverse proxy server\n   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)\n   Active: active (running) since Mon 2023-01-15 10:30:22 UTC; 1h ago",
            hint: "Escribe 'systemctl status nginx' y presiona Enter."
        }
    ],
    advanced: [
        {
            command: "journalctl",
            title: "Comando: journalctl",
            description: "Visualiza y gestiona logs del sistema (systemd).",
            task: "Muestra los logs del servicio 'nginx' de hoy.",
            expectedCmd: /^journalctl\s+-u\s+nginx\s+--since\s+today$/,
            output: "-- Logs begin at Mon 2023-01-15 10:30:22 UTC, end at Mon 2023-01-15 15:45:10 UTC. --\nJan 15 10:30:22 server systemd[1]: Starting A high performance web server...",
            hint: "Escribe 'journalctl -u nginx --since today' y presiona Enter."
        },
        {
            command: "systemctl",
            title: "Comando: systemctl (avanzado)",
            description: "Gestiona servicios, unidades y el estado del sistema.",
            task: "Reinicia el servicio 'nginx'.",
            expectedCmd: /^sudo\s+systemctl\s+restart\s+nginx$/,
            output: "",
            hint: "Escribe 'sudo systemctl restart nginx' y presiona Enter."
        },
        {
            command: "service",
            title: "Comando: service",
            description: "Controla servicios en sistemas init (legacy).",
            task: "Verifica el estado del servicio 'apache2'.",
            expectedCmd: /^sudo\s+service\s+apache2\s+status$/,
            output: " * apache2 is running",
            hint: "Escribe 'sudo service apache2 status' y presiona Enter."
        },
        {
            command: "ss",
            title: "Comando: ss",
            description: "Muestra estadísticas de sockets (conexiones de red).",
            task: "Muestra todas las conexiones TCP establecidas.",
            expectedCmd: /^ss\s+-tuln$/,
            output: "Netid  State  Recv-Q Send-Q Local Address:Port  Peer Address:Port\ntcp    ESTAB  0      0      192.168.1.100:22      192.168.1.1:54322",
            hint: "Escribe 'ss -tuln' y presiona Enter."
        },
        {
            command: "netstat",
            title: "Comando: netstat",
            description: "Muestra conexiones de red (obsoleto, usar ss).",
            task: "Muestra todas las conexiones activas.",
            expectedCmd: /^netstat\s+-tulnp$/,
            output: "Active Internet connections (only servers)\nProto Recv-Q Send-Q Local Address  Foreign Address State  PID/Program name",
            hint: "Escribe 'netstat -tulnp' y presiona Enter."
        },
        {
            command: "iptables",
            title: "Comando: iptables",
            description: "Administra el firewall (netfilter).",
            task: "Lista todas las reglas de iptables.",
            expectedCmd: /^sudo\s+iptables\s+-L$/,
            output: "Chain INPUT (policy ACCEPT)\ntarget prot opt source destination\nACCEPT all -- anywhere anywhere",
            hint: "Escribe 'sudo iptables -L' y presiona Enter."
        },
        {
            command: "nft",
            title: "Comando: nft",
            description: "Nueva generación de firewall (reemplazo de iptables).",
            task: "Lista todas las reglas de nftables.",
            expectedCmd: /^sudo\s+nft\s+list\s+ruleset$/,
            output: "table inet filter {\n chain input {\n type filter hook input priority 0\n }\n}",
            hint: "Escribe 'sudo nft list ruleset' y presiona Enter."
        },
        {
            command: "ip",
            title: "Comando: ip",
            description: "Administra interfaces de red (reemplazo de ifconfig).",
            task: "Muestra información de todas las interfaces de red.",
            expectedCmd: /^ip\s+a$/,
            output: "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default",
            hint: "Escribe 'ip a' y presiona Enter."
        },
        {
            command: "hostnamectl",
            title: "Comando: hostnamectl",
            description: "Gestiona el nombre del host y configuración relacionada.",
            task: "Cambia el nombre del host a 'servidor1'.",
            expectedCmd: /^sudo\s+hostnamectl\s+set-hostname\s+servidor1$/,
            output: "",
            hint: "Escribe 'sudo hostnamectl set-hostname servidor1' y presiona Enter."
        },
        {
            command: "useradd",
            title: "Comando: useradd",
            description: "Crea nuevos usuarios.",
            task: "Crea un usuario llamado 'nuevousuario'.",
            expectedCmd: /^sudo\s+useradd\s+-m\s+nuevousuario$/,
            output: "",
            hint: "Escribe 'sudo useradd -m nuevousuario' y presiona Enter."
        },
        {
            command: "usermod",
            title: "Comando: usermod",
            description: "Modifica propiedades de usuario.",
            task: "Añade 'nuevousuario' al grupo 'sudo'.",
            expectedCmd: /^sudo\s+usermod\s+-aG\s+sudo\s+nuevousuario$/,
            output: "",
            hint: "Escribe 'sudo usermod -aG sudo nuevousuario' y presiona Enter."
        },
        {
            command: "userdel",
            title: "Comando: userdel",
            description: "Elimina usuarios.",
            task: "Elimina el usuario 'nuevousuario'.",
            expectedCmd: /^sudo\s+userdel\s+-r\s+nuevousuario$/,
            output: "",
            hint: "Escribe 'sudo userdel -r nuevousuario' y presiona Enter."
        },
        {
            command: "groupadd",
            title: "Comando: groupadd",
            description: "Crea nuevos grupos.",
            task: "Crea un grupo llamado 'desarrolladores'.",
            expectedCmd: /^sudo\s+groupadd\s+desarrolladores$/,
            output: "",
            hint: "Escribe 'sudo groupadd desarrolladores' y presiona Enter."
        },
        {
            command: "passwd",
            title: "Comando: passwd",
            description: "Cambia contraseñas de usuario.",
            task: "Cambia la contraseña del usuario actual.",
            expectedCmd: /^passwd$/,
            output: "Changing password for usuario.\n(current) UNIX password: \nEnter new UNIX password: \nRetype new UNIX password:",
            hint: "Escribe 'passwd' y presiona Enter, luego sigue las instrucciones."
        },
        {
            command: "sudo",
            title: "Comando: sudo",
            description: "Ejecuta comandos como superusuario.",
            task: "Actualiza la lista de paquetes (apt update).",
            expectedCmd: /^sudo\s+apt\s+update$/,
            output: "Get:1 http://archive.ubuntu.com/ubuntu focal InRelease [265 kB]\n...\nFetched 1,245 kB in 2s (623 kB/s)",
            hint: "Escribe 'sudo apt update' y presiona Enter."
        },
        {
            command: "su",
            title: "Comando: su",
            description: "Cambia al usuario root.",
            task: "Cambia al usuario root.",
            expectedCmd: /^su\s*$/,
            output: "Password: ",
            onSuccess: function() {
                document.getElementById('prompt').textContent = "root@hostname:#";
            },
            hint: "Escribe 'su' y presiona Enter, luego ingresa la contraseña de root."
        },
        {
            command: "lsof",
            title: "Comando: lsof",
            description: "Lista archivos abiertos por procesos.",
            task: "Muestra archivos abiertos por el usuario 'nginx'.",
            expectedCmd: /^sudo\s+lsof\s+-u\s+nginx$/,
            output: "COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME\nnginx 1234 nginx cwd DIR 8,1 4096 2 /",
            hint: "Escribe 'sudo lsof -u nginx' y presiona Enter."
        },
        {
            command: "strace",
            title: "Comando: strace",
            description: "Traza llamadas al sistema y señales.",
            task: "Traza el comando 'ls'.",
            expectedCmd: /^strace\s+ls$/,
            output: "execve(\"/bin/ls\", [\"ls\"], 0x7ffd12345678 /* 23 vars */) = 0\nbrk(NULL) = 0x55a123456000",
            hint: "Escribe 'strace ls' y presiona Enter."
        },
        {
            command: "tcpdump",
            title: "Comando: tcpdump",
            description: "Captura y analiza tráfico de red.",
            task: "Captura paquetes en la interfaz eth0.",
            expectedCmd: /^sudo\s+tcpdump\s+-i\s+eth0$/,
            output: "tcpdump: verbose output suppressed, use -v or -vv for full protocol decode\nlistening on eth0, link-type EN10MB (Ethernet)",
            hint: "Escribe 'sudo tcpdump -i eth0' y presiona Enter."
        },
        {
            command: "screen",
            title: "Comando: screen",
            description: "Multiplexor de terminal (sesiones persistentes).",
            task: "Inicia una nueva sesión de screen.",
            expectedCmd: /^screen$/,
            output: "",
            hint: "Escribe 'screen' y presiona Enter."
        },
        {
            command: "tmux",
            title: "Comando: tmux",
            description: "Multiplexor de terminal moderno.",
            task: "Inicia una nueva sesión de tmux.",
            expectedCmd: /^tmux$/,
            output: "",
            hint: "Escribe 'tmux' y presiona Enter."
        },
        {
            command: "nc",
            title: "Comando: nc (netcat)",
            description: "Herramienta de red versátil.",
            task: "Escucha en el puerto 8080.",
            expectedCmd: /^nc\s+-l\s+8080$/,
            output: "",
            hint: "Escribe 'nc -l 8080' y presiona Enter."
        },
        {
            command: "rsync",
            title: "Comando: rsync",
            description: "Sincroniza archivos eficientemente.",
            task: "Sincroniza 'documentos/' a 'backup/' localmente.",
            expectedCmd: /^rsync\s+-avz\s+documentos\/\s+backup\/$/,
            output: "sending incremental file list\ndocumentos/\ndocumentos/archivo1.txt\n\nsent 1,024 bytes received 42 bytes 2,132.00 bytes/sec",
            hint: "Escribe 'rsync -avz documentos/ backup/' y presiona Enter."
        },
        {
            command: "scp",
            title: "Comando: scp",
            description: "Copia archivos entre hosts vía SSH.",
            task: "Copia 'archivo.txt' a un servidor remoto.",
            expectedCmd: /^scp\s+archivo\.txt\s+usuario@servidor:\/ruta\/destino\/$/,
            output: "archivo.txt 100% 1024 1.0MB/s 00:00",
            hint: "Escribe 'scp archivo.txt usuario@servidor:/ruta/destino/' y presiona Enter."
        },
        {
            command: "ssh",
            title: "Comando: ssh",
            description: "Conecta a hosts remotos de forma segura.",
            task: "Conéctate a 'servidor' como 'usuario'.",
            expectedCmd: /^ssh\s+usuario@servidor$/,
            output: "The authenticity of host 'servidor (192.168.1.100)' can't be established...\nusuario@servidor's password: ",
            onSuccess: function() {
                document.getElementById('prompt').textContent = "usuario@servidor:~$";
            },
            hint: "Escribe 'ssh usuario@servidor' y presiona Enter."
        },
        {
            command: "mount",
            title: "Comando: mount (avanzado)",
            description: "Monta sistemas de archivos con opciones.",
            task: "Monta '/dev/sdb1' en '/mnt/datos' con opciones.",
            expectedCmd: /^sudo\s+mount\s+-o\s+rw,noatime\s+\/dev\/sdb1\s+\/mnt\/datos$/,
            output: "",
            hint: "Escribe 'sudo mount -o rw,noatime /dev/sdb1 /mnt/datos' y presiona Enter."
        },
        {
            command: "lsattr",
            title: "Comando: lsattr",
            description: "Lista atributos de archivos en sistemas ext2/3/4.",
            task: "Muestra atributos de 'archivo.txt'.",
            expectedCmd: /^lsattr\s+archivo\.txt$/,
            output: "----i--------e-- archivo.txt",
            hint: "Escribe 'lsattr archivo.txt' y presiona Enter."
        },
        {
            command: "chattr",
            title: "Comando: chattr",
            description: "Cambia atributos de archivos en sistemas ext2/3/4.",
            task: "Haz que 'archivo.txt' sea inmutable.",
            expectedCmd: /^sudo\s+chattr\s+\+i\s+archivo\.txt$/,
            output: "",
            hint: "Escribe 'sudo chattr +i archivo.txt' y presiona Enter."
        },
        {
            command: "setfacl",
            title: "Comando: setfacl",
            description: "Establece ACLs (Listas de Control de Acceso).",
            task: "Da permisos de lectura a 'usuario2' en 'archivo.txt'.",
            expectedCmd: /^setfacl\s+-m\s+u:usuario2:r\s+archivo\.txt$/,
            output: "",
            hint: "Escribe 'setfacl -m u:usuario2:r archivo.txt' y presiona Enter."
        },
        {
            command: "nice",
            title: "Comando: nice",
            description: "Ejecuta procesos con prioridad modificada.",
            task: "Ejecuta 'proceso.sh' con prioridad 10.",
            expectedCmd: /^nice\s+-n\s+10\s+\.\/proceso\.sh$/,
            output: "",
            hint: "Escribe 'nice -n 10 ./proceso.sh' y presiona Enter."
        },
        {
            command: "nohup",
            title: "Comando: nohup",
            description: "Ejecuta procesos que persisten tras cerrar sesión.",
            task: "Ejecuta 'servidor.sh' en background que persista.",
            expectedCmd: /^nohup\s+\.\/servidor\.sh\s+&$/,
            output: "nohup: ignoring input and appending output to 'nohup.out'",
            hint: "Escribe 'nohup ./servidor.sh &' y presiona Enter."
        },
        {
            command: "sysctl",
            title: "Comando: sysctl",
            description: "Configura parámetros del kernel en tiempo real.",
            task: "Muestra todos los parámetros del kernel.",
            expectedCmd: /^sysctl\s+-a$/,
            output: "kernel.ostype = Linux\nkernel.osrelease = 5.4.0-80-generic\n...",
            hint: "Escribe 'sysctl -a' y presiona Enter."
        },
        {
            command: "dmesg",
            title: "Comando: dmesg",
            description: "Muestra mensajes del buffer del kernel.",
            task: "Muestra los últimos mensajes del kernel.",
            expectedCmd: /^dmesg$/,
            output: "[    0.000000] Linux version 5.4.0-80-generic (buildd@lcy01-amd64-001)\n[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-5.4.0-80-generic",
            hint: "Escribe 'dmesg' y presiona Enter."
        },
        {
            command: "grub-install",
            title: "Comando: grub-install",
            description: "Instala el gestor de arranque GRUB.",
            task: "Reinstala GRUB en '/dev/sda'.",
            expectedCmd: /^sudo\s+grub-install\s+\/dev\/sda$/,
            output: "Installing for i386-pc platform.\nInstallation finished. No error reported.",
            hint: "Escribe 'sudo grub-install /dev/sda' y presiona Enter."
        },
        {
            command: "mkfs",
            title: "Comando: mkfs",
            description: "Crea sistemas de archivos en particiones.",
            task: "Crea un sistema ext4 en '/dev/sdb1'.",
            expectedCmd: /^sudo\s+mkfs\.ext4\s+\/dev\/sdb1$/,
            output: "mke2fs 1.45.5 (07-Jan-2020)\nCreating filesystem with 2621440 4k blocks and 655360 inodes",
            hint: "Escribe 'sudo mkfs.ext4 /dev/sdb1' y presiona Enter."
        }
    ]
};

// Variables de estado
let currentLevel = 'basic';
let currentCommandIndex = 0;
let completedCommands = {
    basic: [],
    intermediate: [],
    advanced: []
};
let unlockedLevels = ['basic'];
let earnedFlags = [];

// Elementos del DOM
const introScreen = document.getElementById('intro-screen');
const appContainer = document.getElementById('app-container');
const startBtn = document.getElementById('start-btn');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const commandTitle = document.getElementById('command-title');
const commandDescription = document.getElementById('command-description');
const taskDescription = document.getElementById('task-description');
const hintBtn = document.getElementById('hint-btn');
const hintText = document.getElementById('hint-text');
const hintContainer = document.getElementById('hint-container');
const commandCounter = document.getElementById('command-counter');
const levelSelector = document.getElementById('level-selector');
const progressText = document.getElementById('progress-text');
const flagsContainer = document.getElementById('flags-container');
const submitFlagBtn = document.getElementById('submit-flag-btn');
const flagModal = document.getElementById('flag-modal');
const flagInput = document.getElementById('flag-input');
const verifyFlagBtn = document.getElementById('verify-flag-btn');
const closeFlagBtn = document.getElementById('close-flag-btn');
const flagMessage = document.getElementById('flag-message');
const showCommandsListBtn = document.getElementById('show-commands-list');
const commandsListModal = document.getElementById('commands-list-modal');
const closeCommandsListBtn = document.getElementById('close-commands-list');
const commandListContent = document.getElementById('command-list-content');
const instructionsModal = document.getElementById('instructions-modal');
const closeInstructionsBtn = document.getElementById('close-instructions');
const promptElement = document.getElementById('prompt');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Configurar event listeners
    startBtn.addEventListener('click', startApp);
    terminalInput.addEventListener('keydown', handleTerminalInput);
    hintBtn.addEventListener('click', showHint);
    submitFlagBtn.addEventListener('click', showFlagModal);
    verifyFlagBtn.addEventListener('click', verifyFlag);
    closeFlagBtn.addEventListener('click', hideFlagModal);
    showCommandsListBtn.addEventListener('click', showCommandsList);
    closeCommandsListBtn.addEventListener('click', hideCommandsList);
    closeInstructionsBtn.addEventListener('click', hideInstructions);
    document.getElementById('reset-progress-btn').addEventListener('click', showResetModal);
    document.getElementById('cancel-reset-btn').addEventListener('click', hideResetModal);
    document.getElementById('confirm-reset-btn').addEventListener('click', confirmReset);
    
    // Mostrar modal de instrucciones al inicio
    setTimeout(() => {
        instructionsModal.classList.remove('hide');
    }, 500);
    
    // Cargar progreso guardado
    loadProgress();
});

function startApp() {
    introScreen.classList.add('hide');
    appContainer.classList.remove('hide');
    showCommandsListBtn.classList.remove('hide');
    initializeLevel(currentLevel);
}

function initializeLevel(level) {
    currentLevel = level;
    currentCommandIndex = 0;
    
    // Actualizar selector de niveles
    updateLevelSelector();
    
    // Actualizar progreso
    updateProgress();
    
    // Mostrar el primer comando del nivel
    showCurrentCommand();
}

function showCurrentCommand() {
    const command = commandData[currentLevel][currentCommandIndex];
    
    commandTitle.textContent = command.title;
    commandDescription.textContent = command.description;
    taskDescription.textContent = command.task;
    hintText.textContent = command.hint;
    hintContainer.classList.add('hide');
    
    // Actualizar contador de comandos
    commandCounter.textContent = `Comando ${currentCommandIndex + 1} de ${commandData[currentLevel].length}`;
    
    // Enfocar el input de la terminal
    terminalInput.focus();
}

function handleTerminalInput(e) {
    if (e.key === 'Enter') {
        const input = terminalInput.value.trim();
        terminalInput.value = '';
        
        // Mostrar el comando ejecutado
        addToTerminalOutput(`${promptElement.textContent} ${input}`);
        
        // Manejar comandos especiales
        if (input.toLowerCase() === 'help') {
            showHelp();
            return;
        }
        
        if (input.toLowerCase() === 'clear') {
            clearTerminal();
            return;
        }
        
        // Verificar el comando
        checkCommand(input);
    }
}

function checkCommand(input) {
    const currentCommand = commandData[currentLevel][currentCommandIndex];
    
    // Saltar comandos "meta" como clear
    if (currentCommand.isMetaCommand) {
        if (currentCommand.expectedCmd.test(input)) {
            clearTerminal();
            addToTerminalOutput(currentCommand.output || '');
            if (currentCommand.onSuccess) currentCommand.onSuccess();
        }
        return;
    }
    
    if (currentCommand.expectedCmd.test(input)) {
        // Mostrar mensaje de éxito
        showCommandSuccess();
        
        // Ejecutar acciones del comando
        if (currentCommand.onSuccess) currentCommand.onSuccess();
        
        // Marcar como completado si no lo estaba
        if (!completedCommands[currentLevel].includes(currentCommandIndex)) {
            completedCommands[currentLevel].push(currentCommandIndex);
            saveProgress();
        }
        
        // Limpiar terminal después de un breve retraso
        setTimeout(() => {
            clearTerminal();
            
            // Avanzar al siguiente comando o completar nivel
            if (currentCommandIndex < commandData[currentLevel].length - 1) {
                currentCommandIndex++;
                showCurrentCommand();
            } else {
                levelCompleted();
            }
            
            updateProgress();
        }, 1500);
    } else {
        addToTerminalOutput(`Error: Comando incorrecto. Intenta nuevamente.\n${currentCommand.hint}`);
    }
}

function showCommandSuccess() {
    clearTerminal();
    
    const successMsg = document.createElement('div');
    successMsg.className = 'command-success';
    successMsg.innerHTML = `
        <div class="success-content">
            <h3>¡Enhorabuena!</h3>
            <p>El comando es correcto.</p>
            <p>Pasemos al siguiente comando...</p>
        </div>
    `;
    
    document.getElementById('terminal-output').appendChild(successMsg);
    
    // Estilo para el mensaje de éxito
    const style = document.createElement('style');
    style.textContent = `
        .command-success {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 10;
        }
        .success-content {
            background: rgba(30, 30, 30, 0.9);
            padding: 2rem;
            border-radius: 5px;
            border: 2px solid var(--success-color);
        }
        .command-success h3 {
            color: var(--success-color);
            margin-top: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Eliminar el mensaje después de 1.5 segundos
    setTimeout(() => {
        successMsg.remove();
        style.remove();
    }, 1500);
}

function levelCompleted() {
    const levelConfig = LEVELS_CONFIG[currentLevel];
    
    if (!earnedFlags.includes(levelConfig.flag)) {
        earnedFlags.push(levelConfig.flag);
        saveProgress();
        
        // Limpiar terminal y mostrar mensaje de éxito
        clearTerminal();
        addToTerminalOutput(`¡NIVEL ${levelConfig.name.toUpperCase()} COMPLETADO!\n\n`);
        addToTerminalOutput(`Tu FLAG de verificación es:\n\n${levelConfig.flag}\n\n`);
        addToTerminalOutput(`Copia esta FLAG y úsala para desbloquear el siguiente nivel.\n`);
        addToTerminalOutput(`También puedes continuar practicando los comandos de este nivel.\n`);
        
        // Mostrar botón para insertar flag automáticamente
        setTimeout(() => {
            showFlagModal();
        }, 1500);
    }
    
    updateProgress();
}

function updateLevelSelector() {
    levelSelector.innerHTML = '';
    
    LEVEL_ORDER.forEach(level => {
        const levelConfig = LEVELS_CONFIG[level];
        const btn = document.createElement('button');
        btn.className = 'level-btn';
        btn.textContent = levelConfig.name;
        
        if (level === currentLevel) {
            btn.classList.add('active');
        }
        
        if (!unlockedLevels.includes(level)) {
            btn.classList.add('locked');
        }
        
        btn.addEventListener('click', () => {
            if (unlockedLevels.includes(level)) {
                initializeLevel(level);
            }
        });
        
        levelSelector.appendChild(btn);
    });
}

function updateProgress() {
    const levelConfig = LEVELS_CONFIG[currentLevel];
    const completedCount = completedCommands[currentLevel].length;
    
    progressText.textContent = `${levelConfig.name}: ${completedCount}/${levelConfig.requiredCmdCount} comandos`;
    
    // Actualizar flags
    flagsContainer.innerHTML = '';
    LEVEL_ORDER.forEach(level => {
        const flag = LEVELS_CONFIG[level].flag;
        const flagElement = document.createElement('span');
        flagElement.className = 'flag';
        flagElement.textContent = flag;
        
        if (earnedFlags.includes(flag)) {
            flagElement.classList.add('earned');
        }
        
        flagsContainer.appendChild(flagElement);
    });
    
    // Verificar si se puede desbloquear el siguiente nivel
    checkForNextLevel();
}

function checkForNextLevel() {
    const currentIndex = LEVEL_ORDER.indexOf(currentLevel);
    
    if (currentIndex < LEVEL_ORDER.length - 1) {
        const nextLevel = LEVEL_ORDER[currentIndex + 1];
        
        if (!unlockedLevels.includes(nextLevel) && 
            completedCommands[currentLevel].length >= LEVELS_CONFIG[currentLevel].requiredCmdCount) {
            // Mostrar mensaje para que el usuario introduzca la flag
            addToTerminalOutput(`\n¡Has completado suficientes comandos para desbloquear el siguiente nivel!\nUsa el botón "Insertar FLAG" para introducir tu flag y desbloquear el nivel ${LEVELS_CONFIG[nextLevel].name}.`);
        }
    }
}

function showFlagModal() {
    flagModal.classList.remove('hide');
    flagInput.focus();
}

function hideFlagModal() {
    flagModal.classList.add('hide');
    flagMessage.classList.add('hide');
    terminalInput.focus();
}

function verifyFlag() {
    const inputFlag = flagInput.value.trim();
    const currentIndex = LEVEL_ORDER.indexOf(currentLevel);
    
    if (currentIndex < LEVEL_ORDER.length - 1) {
        const nextLevel = LEVEL_ORDER[currentIndex + 1];
        const nextLevelFlag = LEVELS_CONFIG[currentLevel].flag; // La flag del nivel actual desbloquea el siguiente
        
        if (inputFlag === nextLevelFlag) {
            flagMessage.textContent = `¡CORRECTO! Nivel ${LEVELS_CONFIG[nextLevel].name} desbloqueado.`;
            flagMessage.className = 'flag-msg success';
            flagMessage.classList.remove('hide');
            
            if (!unlockedLevels.includes(nextLevel)) {
                unlockedLevels.push(nextLevel);
                saveProgress();
            }
            
            flagInput.value = '';
            
            setTimeout(() => {
                hideFlagModal();
                clearTerminal();
                initializeLevel(nextLevel);
                addToTerminalOutput(`¡BIENVENIDO AL NIVEL ${LEVELS_CONFIG[nextLevel].name.toUpperCase()}!\n`);
                addToTerminalOutput(`Escribe 'help' si necesitas ayuda.\n`);
            }, 2000);
        } else {
            flagMessage.textContent = 'Flag incorrecta. Verifica y vuelve a intentar.';
            flagMessage.className = 'flag-msg error';
            flagMessage.classList.remove('hide');
        }
    } else {
        flagMessage.textContent = '¡Felicidades! Has completado todos los niveles.';
        flagMessage.className = 'flag-msg success';
        flagMessage.classList.remove('hide');
    }
}

//  limpiar la terminal
function clearTerminal() {
    terminalOutput.textContent = '';
    // Mostrar prompt limpio
    addToTerminalOutput("Bienvenido a la terminal de Linux.\n");
    addToTerminalOutput("Escribe los comandos y presiona Enter para ejecutarlos.\n");
    addToTerminalOutput("Escribe 'help' para ver comandos disponibles.\n\n");
}

function showHint() {
    hintContainer.classList.toggle('hide');
}

function addToTerminalOutput(text) {
    terminalOutput.textContent += (terminalOutput.textContent ? '\n' : '') + text;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}



function showHelp() {
    addToTerminalOutput(`Comandos disponibles:
- help: Muestra esta ayuda
- clear: Limpia la terminal
- Los comandos específicos para cada ejercicio se muestran en la descripción`);
}

function showCommandsList() {
    commandsListModal.classList.remove('hide');
    
    // Generar contenido de la lista de comandos
    let content = '<h4>Comandos por Nivel</h4>';
    
    LEVEL_ORDER.forEach(level => {
        if (unlockedLevels.includes(level)) {
            const levelConfig = LEVELS_CONFIG[level];
            content += `<h5>${levelConfig.name}</h5><ul>`;
            
            commandData[level].forEach((cmd, index) => {
                const isCompleted = completedCommands[level].includes(index);
                content += `<li>${cmd.command} - ${isCompleted ? '✅' : '❌'}</li>`;
            });
            
            content += '</ul>';
        }
    });
    
    commandListContent.innerHTML = content;
}

function hideCommandsList() {
    commandsListModal.classList.add('hide');
    terminalInput.focus();
}

function hideInstructions() {
    instructionsModal.classList.add('hide');
}

// Guardar y cargar progreso
function saveProgress() {
    const progress = {
        version: 1,
        currentLevel,
        completedCommands,
        unlockedLevels,
        earnedFlags,
        levelFlags: {
            basic: LEVELS_CONFIG.basic.flag,
            intermediate: LEVELS_CONFIG.intermediate.flag,
            advanced: LEVELS_CONFIG.advanced.flag
        },
        lastSaved: new Date().toISOString()
    };
    localStorage.setItem('linuxTerminalProgress', JSON.stringify(progress));
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('linuxTerminalProgress');
        if (!saved) {
            initializeDefaultProgress();
            return;
        }
        
        const progress = JSON.parse(saved);
        
        if (!progress.version || !progress.levelFlags) {
            throw new Error("Estructura de progreso inválida");
        }
        
        // Restaurar estado con valores por defecto como fallback
        currentLevel = progress.currentLevel || 'basic';
        completedCommands = progress.completedCommands || {
            basic: [], intermediate: [], advanced: []
        };
        unlockedLevels = progress.unlockedLevels || ['basic'];
        earnedFlags = progress.earnedFlags || [];
        
        // Restaurar flags manteniendo las existentes o generando nuevas
        LEVELS_CONFIG.basic.flag = progress.levelFlags.basic || generateFlag();
        LEVELS_CONFIG.intermediate.flag = progress.levelFlags.intermediate || generateFlag();
        LEVELS_CONFIG.advanced.flag = progress.levelFlags.advanced || generateFlag();
        
    } catch (e) {
        console.error('Error cargando progreso:', e);
        initializeDefaultProgress();
    }
}

// Función para inicializar progreso por defecto
function initializeDefaultProgress() {
    currentLevel = 'basic';
    completedCommands = {
        basic: [],
        intermediate: [],
        advanced: []
    };
    unlockedLevels = ['basic'];
    earnedFlags = [];
    
    // Generar nuevas flags solo si no existen
    LEVELS_CONFIG.basic.flag = LEVELS_CONFIG.basic.flag || generateFlag();
    LEVELS_CONFIG.intermediate.flag = LEVELS_CONFIG.intermediate.flag || generateFlag();
    LEVELS_CONFIG.advanced.flag = LEVELS_CONFIG.advanced.flag || generateFlag();
    
    saveProgress(); // Guardar estado inicial
}

// Función para resetear completamente el progreso

// Función para mostrar el modal de reinicio
function showResetModal() {
    document.getElementById('reset-modal').classList.remove('hide');
    document.getElementById('reset-message').classList.add('hide');
}

// Función para ocultar el modal
function hideResetModal() {
    document.getElementById('reset-modal').classList.add('hide');
}

// Función para confirmar el reinicio
function confirmReset() {
    // 1. Borrar progreso
    localStorage.removeItem('linuxTerminalProgress');
    
    // 2. Resetear variables
    currentLevel = 'basic';
    currentCommandIndex = 0;
    completedCommands = {
        basic: [],
        intermediate: [],
        advanced: []
    };
    unlockedLevels = ['basic'];
    earnedFlags = [];
    
    // 3. Regenerar flags
    LEVELS_CONFIG.basic.flag = generateFlag();
    LEVELS_CONFIG.intermediate.flag = generateFlag();
    LEVELS_CONFIG.advanced.flag = generateFlag();
    
    // 4. Mostrar mensaje de éxito
    const msg = document.getElementById('reset-message');
    msg.textContent = '¡Progreso reiniciado correctamente!';
    msg.className = 'flag-msg success';
    msg.classList.remove('hide');
    
    // 5. Ocultar modal después de 2 segundos
    setTimeout(() => {
        hideResetModal();
        
        // 6. Actualizar UI
        updateLevelSelector();
        updateProgress();
        showCurrentCommand();
        clearTerminal();
        
        // 7. Mostrar instrucciones iniciales
        addToTerminalOutput("Progreso reiniciado. Comenzando desde el nivel básico.\n");
    }, 2000);
}