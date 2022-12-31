import { useState } from "react"
import { Button } from "@shopify/polaris"

export default function ItemInfor({ name, location }) {
    const [viewBtn, setViewBtn] = useState(false)

    return (
        <div onMouseOver={() => setViewBtn(true)} onMouseLeave={() => setViewBtn(false)} style={{ position: "relative" }}>
            <p>
                {name}
            </p>
            <div>{location}</div>
            {viewBtn ? (
                <div style={{ position: "absolute", right: "0", top: "20%", transform:"translateY(-30%)" }}>
                    <Button size="slim">View Page</Button>
                </div>)
                :null}
        </div>
    )
}