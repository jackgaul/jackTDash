# a dataclass to store the messages and the tool calls
from dataclasses import dataclass
from typing import List


@dataclass
class Conversation:
    system_prompt: dict
    messages: List[dict]
    tools: List[dict]
