from flask import Blueprint, request, jsonify
from LLMAgent import llm_ticket_base_attributes
import json

bp = Blueprint("llm", __name__)


@bp.route("/get_base_attributes", methods=["POST"])
def get_llm_base_attributes():
    data = request.json
    llm_ticket_attributes = llm_ticket_base_attributes(data["user_prompt"])

    if llm_ticket_attributes["type"] == "create_ticket":
        llm_ticket_attributes = json.loads(llm_ticket_attributes["response"])
        return jsonify({"message": llm_ticket_attributes}), 200
    else:
        empty_ticket = {
            "title": "Need to Specify Title",
            "description": "Need to Specify Description",
            "status": "open",
            "priority": "low",
            "category": "unspecified",
        }
        return jsonify({"message": empty_ticket}), 200
