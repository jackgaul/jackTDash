from dotenv import load_dotenv
import os
from dataclasses import dataclass
from typing import List

from pathlib import Path
from openai import OpenAI
from .system_prompts import (
    get_JackT_Agent_system_prompt,
    get_Ticket_Attributes_system_prompt,
    get_Plan_Agent_system_prompt,
)
from .tools import (
    get_application_route_tool,
    create_ticket_tool,
)

load_dotenv(Path(__file__).parent.parent / ".env")
client = OpenAI()


@dataclass
class Conversation:
    messages: List[dict]
    tools: List[dict]


def openai_request(conversation, tool_function):

    if tool_function:
        conversation.tools = tool_function()
    else:
        conversation.tools = []

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
            get_JackT_Agent_system_prompt(),
            {"role": "user", "content": user_prompt},
        ],
        tools=[],
    )
    response = openai_request(conversation, get_application_route_tool)
    if response.choices[0].message.tool_calls:
        tool_call = response.choices[0].message.tool_calls
        handle_tool_call(tool_call)
    else:
        print(response.choices[0].message.content)


def llm_ticket_base_attributes(user_prompt):
    conversation = Conversation(
        messages=[
            get_Ticket_Attributes_system_prompt(),
            {"role": "user", "content": user_prompt},
        ],
        tools=[],
    )
    response = openai_request(conversation, create_ticket_tool)
    if response.choices[0].message.tool_calls:

        return {
            "response": response.choices[0].message.tool_calls[0].function.arguments,
            "type": "create_ticket",
        }
    else:
        print(response.choices[0].message.content)
        return {"response": response.choices[0].message.content, "type": "message"}


def llm_plan_agent(user_prompt):
    conversation = Conversation(
        messages=[
            get_Plan_Agent_system_prompt(),
            {"role": "user", "content": user_prompt},
        ],
        tools=[],
    )
    response = openai_request(conversation, None)
    if response.choices[0].message.content:
        return {"response": response.choices[0].message.content, "type": "message"}
    else:
        print(response.choices[0].message.content)
        return {"response": "Error: No response from agent", "type": "message"}


if __name__ == "__main__":
    query = "Create a new Slack channel called 'test' and invite 'test@test.com' to it"
    llm_ticket_base_attributes(query)
