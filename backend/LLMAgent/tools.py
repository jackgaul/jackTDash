"""This module provides high-level functions returning tool contexts for an IT agent."""

from typing import List, Dict, Any


def get_application_route_tool() -> List[Dict[str, Any]]:
    """Return a list of available applications that can be used."""
    return [
        {
            "type": "function",
            "function": {
                "name": "get_slack_tools",
                "description": "This tool returns a list of tools for interacting with Slack workspace",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "reason": {
                            "type": "string",
                            "description": "Reason for calling the tool",
                        },
                        "message_to_user": {
                            "type": "string",
                            "description": "Message to the user to fill them in on the progress of the task",
                        },
                    },
                    "required": ["reason", "message_to_user"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_zoom_tools",
                "description": "This tool returns a list of tools for managing Zoom meetings and users",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "reason": {
                            "type": "string",
                            "description": "Reason for calling the tool",
                        },
                        "message_to_user": {
                            "type": "string",
                            "description": "Message to the user to fill them in on the progress of the task",
                        },
                    },
                    "required": ["reason", "message_to_user"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_notion_tools",
                "description": "This tool returns a list of tools for managing Notion pages and sharing",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "reason": {
                            "type": "string",
                            "description": "Reason for calling the tool",
                        },
                        "message_to_user": {
                            "type": "string",
                            "description": "Message to the user to fill them in on the progress of the task",
                        },
                    },
                    "required": ["reason", "message_to_user"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
    ]


def get_slack_tools() -> List[Dict[str, Any]]:
    """Return a list of Slack-related tool functions."""
    return [
        {
            "type": "function",
            "function": {
                "name": "create_slack_channel",
                "description": "Create a new Slack channel with the given name",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "channel_name": {
                            "type": "string",
                            "description": "Name of the Slack channel to create",
                        }
                    },
                    "required": ["channel_name"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
        {
            "type": "function",
            "function": {
                "name": "invite_user_to_slack_channel",
                "description": "Invite a user to a specific Slack channel",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_email": {
                            "type": "string",
                            "description": "Email address of the user to invite",
                        },
                        "channel_name": {
                            "type": "string",
                            "description": "Name of the Slack channel to invite to",
                        },
                    },
                    "required": ["user_email", "channel_name"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
        {
            "type": "function",
            "function": {
                "name": "send_slack_message",
                "description": "Send a message to a Slack channel",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "channel_name": {
                            "type": "string",
                            "description": "Name of the Slack channel to send message to",
                        },
                        "message": {
                            "type": "string",
                            "description": "Message content to send",
                        },
                    },
                    "required": ["channel_name", "message"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
    ]


def get_zoom_tools() -> List[Dict[str, Any]]:
    """Return a list of Zoom-related tool functions."""
    return [
        {
            "type": "function",
            "function": {
                "name": "create_zoom_meeting",
                "description": "Create a Zoom meeting and return its ID or URL",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "topic": {
                            "type": "string",
                            "description": "Topic or title of the Zoom meeting",
                        },
                        "start_time": {
                            "type": "string",
                            "description": "Start time of the meeting in ISO format",
                        },
                    },
                    "required": ["topic", "start_time"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
        {
            "type": "function",
            "function": {
                "name": "invite_user_to_meeting",
                "description": "Invite a user to the specified Zoom meeting",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "meeting_id": {
                            "type": "string",
                            "description": "ID of the Zoom meeting",
                        },
                        "user_email": {
                            "type": "string",
                            "description": "Email address of the user to invite",
                        },
                    },
                    "required": ["meeting_id", "user_email"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
        {
            "type": "function",
            "function": {
                "name": "start_zoom_meeting",
                "description": "Start a Zoom meeting given its ID",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "meeting_id": {
                            "type": "string",
                            "description": "ID of the Zoom meeting to start",
                        }
                    },
                    "required": ["meeting_id"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
    ]


def get_notion_tools() -> List[Dict[str, Any]]:
    """Return a list of Notion-related tool functions."""
    return [
        {
            "type": "function",
            "function": {
                "name": "create_notion_page",
                "description": "Create a Notion page with a given title and content",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Title of the Notion page",
                        },
                        "content": {
                            "type": "string",
                            "description": "Content to be added to the Notion page",
                        },
                    },
                    "required": ["title", "content"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
        {
            "type": "function",
            "function": {
                "name": "share_notion_page",
                "description": "Share an existing Notion page with a user",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "page_id": {
                            "type": "string",
                            "description": "ID of the Notion page to share",
                        },
                        "user_email": {
                            "type": "string",
                            "description": "Email address of the user to share with",
                        },
                    },
                    "required": ["page_id", "user_email"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
        {
            "type": "function",
            "function": {
                "name": "update_notion_page",
                "description": "Update the content of an existing Notion page",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "page_id": {
                            "type": "string",
                            "description": "ID of the Notion page to update",
                        },
                        "new_content": {
                            "type": "string",
                            "description": "New content to update the page with",
                        },
                    },
                    "required": ["page_id", "new_content"],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
    ]


def create_ticket_tool() -> List[Dict[str, Any]]:
    """Return a list of ticket-related tool functions."""
    return [
        {
            "type": "function",
            "function": {
                "name": "create_ticket",
                "description": "Create a new ticket with the given attributes",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Title of the ticket",
                        },
                        "description": {
                            "type": "string",
                            "description": "Description of the ticket",
                        },
                        "status": {
                            "type": "string",
                            "description": "Status of the ticket: open, in-progress, pending, closed",
                        },
                        "priority": {
                            "type": "string",
                            "description": "Priority of the ticket: high, medium, low",
                        },
                        "category": {
                            "type": "string",
                            "description": "Application the bug is related to from the following list: Slack, Google, Network, Email, Software, Okta, General, Device",
                        },
                    },
                    "required": [
                        "title",
                        "description",
                        "status",
                        "priority",
                        "category",
                    ],
                    "additionalProperties": False,
                },
                "strict": True,
            },
        },
    ]
