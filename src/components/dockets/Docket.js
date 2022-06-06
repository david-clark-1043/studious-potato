import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getDocket } from "./DocketManager"
import { Link } from "react-router-dom"
import { adminCheck } from "../../utils/Fetch"
import "./Docket.css"
import { closeDocket } from "../adminTools/AdminManager"

export const Docket = () => {
    const [docket, SetDocket] = useState()
    const [isManager, SetIsManager] = useState(false)
    const { docketId } = useParams()

    const setUpDocket = (docketId) => {
        getDocket(docketId)
            .then(SetDocket)
    }

    useEffect(
        () => {
            if(docketId) {
                setUpDocket(docketId)
            }
        }, [docketId]
    )

    useEffect(
        () => {
            if(docket?.managers.length > 0) {
                let managerCheck = false
                const filerId = parseInt(localStorage.getItem("filerId"))
                for(const manager of docket.managers){
                    if(filerId === manager.id) {
                        managerCheck = true
                    }
                }
                SetIsManager(managerCheck)
            }
        }, [docket]
    )

    const closeCase = () => {
        closeDocket(docketId)
            .then(() => {setUpDocket(docketId)})
    }

    return <div>
        <div>Case Name: {docket?.caseName}</div>
        <div>Case Number: {docket?.caseNum}</div>
        <div>
            <div>manager list</div>
            {
                docket?.managers.map(manager => {
                    return <div key={`manager-${manager.id}`}>
                        {manager.user.firstName} {manager.user.lastName} - {manager.filerType.filerType}
                    </div>
                })
            }
        </div>
        <div>
            {
                isManager
                ? <div>
                    <button
                        onClick={closeCase}
                        >
                        Close Case
                    </button>
                </div>
                : "false"
            }
        </div>
        <div>
            {
                adminCheck()
                ? <Link to={`/dockets/${docket?.id}/assignManagers`}>
                    Assign Managers
                </Link>
                : null
            }
        </div>
        <div>
            {
                docket?.filings.map(filing => {
                    return <div key={`filing-${filing.id}`} className="singleFiling">
                        <div>Docket Number: {filing.docketIndex}</div>
                        <div>Filing Type: {filing.filingType.filingType}</div>
                        <div>
                            <Link to={`/filings/${filing.id}`}>
                                Title: {filing.title}
                            </Link>
                        </div>
                        <div>Filer: {filing.filer.user.firstName} {filing.filer.user.lastName}</div>
                        </div>
                })
            }
        </div>
    </div>
}