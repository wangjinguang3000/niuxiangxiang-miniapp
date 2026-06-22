@echo off
tcb db nosql execute -e cloudbase-4gvjj5qn247cd61a --command "[{\"TableName\":\"config\",\"CommandType\":\"QUERY\",\"Command\":\"{\\\"find\\\":\\\"config\\\",\\\"filter\\\":{\\\"_id\\\":\\\"app\\\"},\\\"limit\\\":1}\"}]" --json
