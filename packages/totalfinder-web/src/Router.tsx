import React from "react"
import { Route, Switch } from "react-router-dom"
import { FromPDF } from "./pages/Home"
import { ToPDF } from "./pages/Test"

export function Router() {
  return (
    <Switch>
      <Route path="/" component={FromPDF} exact />
      <Route path="/another" component={ToPDF} exact />
    </Switch>
  )
}
