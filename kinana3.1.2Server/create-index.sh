curl -X POST --data-binary @- localhost:9200/worldismid <<EOF
{
    "event" : {
        "_timestamp" : {
            "enabled" : true,
            "path": "timestamp"
        }
    }
}
EOF