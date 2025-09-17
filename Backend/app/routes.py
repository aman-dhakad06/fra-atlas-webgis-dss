from flask import Blueprint, jsonify, request
from .models import Village, FRAClaim
from .database import db

bp = Blueprint("api", __name__, url_prefix="/api")

@bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "message": "Backend running"}), 200

@bp.route("/villages", methods=["GET"])
def get_villages():
    villages = Village.query.all()
    return jsonify([{"id": v.id, "name": v.name, "state": v.state} for v in villages])

@bp.route("/claims", methods=["POST"])
def add_claim():
    data = request.json
    claim = FRAClaim(
        claimant_name=data["claimant_name"],
        claim_type=data["claim_type"],
        status="Pending",
        village_id=data["village_id"]
    )
    db.session.add(claim)
    db.session.commit()
    return jsonify({"message": "Claim added", "id": claim.id}), 201
