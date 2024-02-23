import styles from '../styles/components/Tooltip.module.scss'

const Tooltip = ({month,value, name}:{month:string, value: number, name: string}) =>{
return (
    <div className={styles.tooltip}>
        <div className={styles.toolmonth}>
            <p><b>{month}</b></p>
        </div>
        <div className={styles.toolabout}>
            <div className={styles.circle}></div>
            <p>{name}</p>
            <p><b>{value}</b> ₽</p>
        </div>
    </div>
)
}

export default Tooltip;