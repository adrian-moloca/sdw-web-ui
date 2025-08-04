#!/usr/bin/env groovy
@Library('cicd')
import com.ocs.sdw.cicd.*

// env.environment = 'dev'
env.platform = "JS"

def flow = new FlowTypes().getFlow(env.platform, this)
flow.create()