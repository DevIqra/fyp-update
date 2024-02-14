// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Tracking {
    enum ShipmentStatus {
        PENDING,
        INTRANSIT,
        DELEVERD
    }
    struct Shipment {
        address sender;
        address reciever;
        uint256 pickUpTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }
    mapping(address => Shipment[]) public Shipments;
    uint256 public ShipmentCount;
    struct TypeShipment {
        address sender;
        address reciever;
        uint256 pickUpTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }
    TypeShipment[] typeShipments;
    event ShipmentCreated(
        address indexed sender,
        address indexed reciever,
        uint256 pickUpTime,
        uint256 distance,
        uint256 price
    );

    event ShipmentInTransit(
        address indexed sender,
        address indexed reciever,
        uint256 pickUpTime
    );
    event ShipmentDeliverd(
        address indexed sender,
        address indexed reciever,
        uint256 deliveryTime
    );
    event ShipmentPaid(
        address indexed sender,
        address indexed reciever,
        uint256 amount
    );

    constructor() {
        ShipmentCount = 0;
    }

    function CreateShipment(
        address _reciever,
        uint256 _pickupTime,
        uint256 _distance,
        uint256 _price
    ) public payable {
        require(msg.value == _price, "payment amount must match the price");
        Shipment memory shipment = Shipment(
            msg.sender,
            _reciever,
            _pickupTime,
            0,
            _distance,
            _price,
            ShipmentStatus.PENDING,
            false
        );
        Shipments[msg.sender].push(shipment);
        ShipmentCount++;
        typeShipments.push(
            TypeShipment(
                msg.sender,
                _reciever,
                _pickupTime,
                0,
                _distance,
                _price,
                ShipmentStatus.PENDING,
                false
            )
        );
        emit ShipmentCreated(
            msg.sender,
            _reciever,
            _pickupTime,
            _distance,
            _price
        );
    }

    function startShipment(
        address _sender,
        address _reciever,
        uint256 _index
    ) public {
        Shipment storage shipment = Shipments[_sender][_index];
        TypeShipment storage typeShipment = typeShipments[_index];
        require(shipment.reciever == _reciever, "invalid reciever");
        require(
            shipment.status == ShipmentStatus.PENDING,
            "shipment already in transit"
        );
        shipment.status = ShipmentStatus.INTRANSIT;
        typeShipment.status = ShipmentStatus.INTRANSIT;

        emit ShipmentInTransit(_sender, _reciever, shipment.pickUpTime);
    }

    function completeShipment(
        address _sender,
        address _receiver,
        uint256 _index
    ) public {
        Shipment storage shipment = Shipments[_sender][_index];
        TypeShipment storage typeShipment = typeShipments[_index];

        require(shipment.reciever == _receiver, "Invalid receiver");
        require(
            shipment.status == ShipmentStatus.INTRANSIT,
            "Shipment not in transit"
        );
        require(!shipment.isPaid, "Shipment already paid");

        // Additional logic for completing the shipment, e.g., updating status, handling payments, etc.

        // Emit an event indicating the completion of the shipment
        shipment.status == ShipmentStatus.DELEVERD;
        typeShipment.status == ShipmentStatus.DELEVERD;
        typeShipment.deliveryTime = block.timestamp;
        shipment.deliveryTime = block.timestamp;
        uint256 amount = shipment.price;
        payable(shipment.sender).transfer(amount);
        shipment.isPaid = true;
        typeShipment.isPaid = true;

        emit ShipmentDeliverd(_sender, _receiver, shipment.deliveryTime);
        emit ShipmentPaid(_sender, _receiver, amount);
    }

    function getShipment(
        address _sender,
        uint256 _index
    )
        public
        view
        returns (
            address,
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            ShipmentStatus,
            bool
        )
    {
        Shipment memory shipment = Shipments[_sender][_index];
        return (
            shipment.sender,
            shipment.reciever,
            shipment.pickUpTime,
            shipment.deliveryTime,
            shipment.distance,
            shipment.price,
            shipment.status,
            shipment.isPaid
        );
    }
    function getShipmentsCount(address _sender)public view returns(uint256){
        return Shipments[_sender].length;
    }
    function getAllTransactions()public view returns(TypeShipment[] memory){
        return typeShipments;
    }
}
