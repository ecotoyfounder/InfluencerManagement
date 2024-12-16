from sqlalchemy.orm import Session, joinedload
from models import Influencer, Employee


def filter_influencers(
    db: Session,
    name: str = None,
    manager_id: int = None,
    manager_name: str = None,
):
    """
    Filters influencers based on name, manager ID, or manager name.

    :param db: The database session.
    :param name: Influencer's first or last name for filtering.
    :param manager_id: Assigned manager's ID for filtering.
    :param manager_name: Assigned manager's first or last name for filtering.
    :return: A list of filtered influencers with social media accounts loaded.
    """
    query = db.query(Influencer).options(
        joinedload(Influencer.social_media_accounts),
        joinedload(Influencer.manager),
    )

    if name:
        query = query.filter(
            Influencer.first_name.contains(name) | Influencer.last_name.contains(name)
        )

    if manager_id:
        query = query.filter(Influencer.manager_id == manager_id)

    if manager_name:
        query = query.join(Employee).filter(
            Employee.first_name.contains(manager_name)
            | Employee.last_name.contains(manager_name)
        )

    return query.all()
