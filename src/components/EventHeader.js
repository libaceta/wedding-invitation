

import styles from './EventHeader.module.css';

const EventHeader = (props) => {

    return(
        <div className={styles.header}>
            <h2>Casamiento de Rocio y Matias</h2>
            <h3>Confirmar asistencia</h3>
            <span className={styles.text}>Presiona "Si, contá conmigo" para ver el resto de los módulos del formulario</span>
        </div>
    )
}

export default EventHeader;