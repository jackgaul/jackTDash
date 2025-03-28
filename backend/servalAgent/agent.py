from dotenv import load_dotenv
import os
from dataclasses import dataclass
from typing import List
from utils import Conversation
from pathlib import Path
from openai import OpenAI
from systemPrompts import (
    get_Serval_Agent_system_prompt,
    get_Slack_Agent_system_prompt,
    get_Zoom_Agent_system_prompt,
    get_Notion_Agent_system_prompt,
)
from tools import (
    get_application_route_tool,
    get_slack_tools,
    get_zoom_tools,
    get_notion_tools,
)

load_dotenv(Path(__file__).parent.parent / ".env")
client = OpenAI()


def openai_request(conversation, tool_function):

    conversation.tools = tool_function()
    # system_prompt = conversation.system_prompt
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversation.messages,
        tools=conversation.tools,
    )

    return response


def handle_tool_call(tool_call):
    if tool_call[0].function.name == "get_slack_tools":
        print(tool_call[0].function)
    elif tool_call[0].function.name == "get_zoom_tools":
        print(tool_call[0].function)
    elif tool_call[0].function.name == "get_notion_tools":
        print(tool_call[0].function)
    else:
        print("No tool call found")


def top_level_agent(user_prompt):
    conversation = Conversation(
        messages=[
            get_Serval_Agent_system_prompt(),
            {"role": "user", "content": user_prompt},
        ],
        tools=[],
        system_prompt=get_Serval_Agent_system_prompt(),
    )
    response = openai_request(conversation, get_application_route_tool)
    if response.choices[0].message.tool_calls:
        tool_call = response.choices[0].message.tool_calls
        handle_tool_call(tool_call)
    else:
        print(response.choices[0].message.content)


query = "Create a new Slack channel called 'test' and invite 'test@test.com' to it"
top_level_agent(query)
