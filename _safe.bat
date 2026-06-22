@echo off
tcb db nosql execute -e cloudbase-4gvjj5qn247cd61a --command "[{\"TableName\":\"config\",\"CommandType\":\"UPDATE\",\"Command\":\"{\\\"update\\\":\\\"config\\\",\\\"updates\\\":[{\\\"q\\\":{\\\"_id\\\":\\\"app\\\"},\\\"u\\\":{\\\"$set\\\":{\\\"ugc_enabled\\\":false}}}]}\"}]" --json
